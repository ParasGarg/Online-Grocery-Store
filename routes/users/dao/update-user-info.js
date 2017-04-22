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
const data = require('../../../data');
const usersData = data.users;
const credentialsData = data.credentials;
const passport = require('../../../config/passport-users');


// check user authenticity
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        // rendering error page
        res.render('alerts/error', {
            mainTitle: "Unauthorized Access •",
            code: 401,
            message: `User is not allowed to access this page.`,
            url: req.originalUrl
        });
    }
}

//------------------------ route to fetch user information for update by email id
router.get('/:email', isLoggedIn, (req, res) => {

    // validating for requested user and logged in user
    // requested user and logged in user must be same to modify information details
    if (req.user._id === req.params.email) {
        // fetching user information
        usersData.getUserById(req.params.email).then((userJsonDocument) => {

            // validating received user information
            if (userJsonDocument != null) {
                // rendering update page for user information update
                res.render(`users/update/${req.params.email}`, {
                    mainTitle: "Dashboard •",
                    code: 200,
                    url: req.originalUrl,
                    userEmail: req.user._id,
                    userName: req.user.name,
                    userMobile: req.user.mobile
                });
            } else {
                // this never would be the case as user authenticity and existance has been checked before
                // rendering error page
                res.render('alerts/error', {
                    mainTitle: "Bad Request •",
                    code: 400,
                    message: `User with '${req.params.email}' email id does not exists.`,
                    url: req.originalUrl
                });
            }
        })
        .catch((collectionError) => {
            // rendering error page
            res.render('alerts/error', {
                mainTitle: "Server Error •",
                code: 500,
                message: collectionError,
                url: req.originalUrl
            });
        });

    } else {
        // rendering error page if requested user and logged in user is not same
        res.render('alerts/error', {
            mainTitle: "Unauthorized Access •",
            code: 401,
            message: `You are not allowed to access this page.`,
            url: req.originalUrl
        });
    }
});

//------------------------ route to update user information by id
router.post('/', isLoggedIn, (req, res) => {

    let userUpdates = req.body;
    let email = req.user._id;
    
    // check for empty json passed
    if (Object.keys(userUpdates).length === 0 || userUpdates == undefined) {
        res.render("users/dashboard/user-account", {
            mainTitle: "Bad Request •",
            code: 400,
            message: `No data has been provided for update.`,
            url: req.originalUrl
        });
    } else {
        // validating user existance
        usersData.getUserById(email).then((userJsonDocument) => {
            credentialsData.getCredentialById(email).then((credentialJsonDocument) => {
                            
                // validating received user and credentials information
                // if user does not exists then value we get will be null 
                if (userJsonDocument == null || credentialJsonDocument == null) {
                    // rendering error page if user does not exists
                    res.render('alerts/error', {
                        mainTitle: "Bad Request •",
                        code: 400,
                        message: `User and credentials with '${email}' email id does not exists.`,
                        url: req.originalUrl
                    });
                } else {

                    // checking for user profile updates
                    if (userUpdates.name || userUpdates.mobile) {
                        // update new json document in users collection for user profile
                        usersData.updateUser(email, userUpdates).then((profileUpdates) => {
                            // redirect to dashboard to reflect changes
                            res.redirect("/user/dashboard");
                        });
                    }

                    // checking for user security updates
                    if (userUpdates.password) {
                        // update new json document in credentials collection for user password
                        credentialsData.updateCredential(email, userUpdates.password).then(() => {
                            // redirect to dashboard to reflect changes
                            res.redirect("/user/dashboard");
                        });
                    }

                    // checking for user payment updates
                    if (userUpdates.paymentInfo) {

                        /*
    **********************
    **********************  INSERT CODE FOR UPDATE OF USER PAYMENT OPTIONS
    **********************
                        */
                    }

                    // checking for user wallet updates
                    if (userUpdates.wallet) {
                        // update new json document in users collection for user profile
                        usersData.updateUser(email, userUpdates).then((walletUpdates) => {
                            // rendering update page with user updated information
                            res.render(`users/update/${walletUpdates._id}`, {
                                mainTitle: "Dashboard •",
                                code: 200,
                                url: req.originalUrl,
                                userEmail: req.user._id,
                                userWallet: walletUpdates.wallet,
                            });
                        });
                    }
                }
            });
        })
        .catch((collectionError) => {
            // rendering error page
            res.render('alerts/error', {
                mainTitle: "Server Error •",
                code: 500,
                message: collectionError,
                url: req.originalUrl
            });
        });
    }
});

// exporting routing apis
module.exports = router;