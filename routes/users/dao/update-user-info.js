/* 
 * Users Routers * Users Configuration *
 * Users Updates *
 * This route file contains apis for user information update operations
 * Functionalities Index: 
        ======================================================================================================
        | S.No. |  Type  |          URL         |   Function Call   | Controller |       Description         |
        ======================================================================================================
        |   1.  | Get    | /user/update/:email  | updateUser        | ***        | Page for update user form |
        ------------------------------------------------------------------------------------------------------
        |   2.  | Put    | /user/update/        | updateUser        | users      | Update user profile info  |
        ------------------------------------------------------------------------------------------------------
*/

/* importing required files and packages */
const express = require('express');
const router = express.Router();
const xss = require('xss');
const validator = require('validator');
const data = require('../../../data');
const usersData = data.users;
const credentialsData = data.credentials;
const passport = require('../../../config/passport-users');

/* local function */
//------ user authentication validation
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.render('alerts/error', {
            mainTitle: "Bad Request •",
		    code: 400,
		    message: "Unauthorized Request Attempt",
            url: req.originalUrl
        });
    }
}

//------------------------ route to update user information by id
router.post('/', isLoggedIn, (req, res) => {

    let userUpdates = req.body;
    let email = xss(req.user._id);

    if (Object.keys(userUpdates).length === 0 || userUpdates == undefined) {    // check for empty json passed
        res.render("users/dashboard/user-account", {
            mainTitle: "Bad Request •",
            code: 400,
            message: `No data has been provided for update.`,
            url: req.originalUrl
        });
    } else if (!validator.isEmail(email)) {     // validating email syntax
        res.render('alerts/error', {
            mainTitle: "Bad Request •",
		    code: 400,
		    message: "Unauthorized Request Attempt",
            url: req.originalUrl
        });
        return;
    } else {

        // validating user existance
        usersData.getUserById(email).then((userJsonDocument) => {
            credentialsData.getCredentialById(email).then((credentialJsonDocument) => {

                // checking for user profile updates
                if (userUpdates.name || userUpdates.mobile) {
                    usersData.updateUser(email, userUpdates).then((profileUpdates) => {
                        res.json({ success: true });
                    });
                }
                
                // checking for user security updates
                if (userUpdates.password) {
                    credentialsData.updateCredential(email, userUpdates.password).then(() => {
                        res.json({ success: true })
                    });
                }

                // checking for user payment updates
                if (userUpdates.paymentInfo) {

                    /*
**********************
**********************  INSERT CODE FOR UPDATE OF USER PAYMENT OPTIONS
**********************
                    */

                        res.redirect("/user/dashboard/payments");
                    
                }

                // checking for user wallet updates
                if (userUpdates.wallet) {
                    usersData.updateUser(email, userUpdates).then((walletUpdates) => {
                        res.json({ success: true })
                    });
                }
            });
        })
        .catch((error) => {     // rendering error page
            res.render('alerts/error', {
                mainTitle: "Server Error •",
                code: 500,
                message: error,
                url: req.originalUrl
            });
        });
    }
});

// exporting routing apis
module.exports = router;