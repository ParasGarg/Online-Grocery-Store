/* 
 * Users Routers * Users Configuration *
 * Create User *
 * This route file contains apis for user creation operations
 * Functionalities Index: 
        =========================================================================================================
        | S.No. |  Type  |        URL        |   Function Call   | Controller |           Description           |
        =========================================================================================================
        |   1.  | Get    | /user/new         | createNewUser     | ***        | Render a page for new user form |
        ---------------------------------------------------------------------------------------------------------
        |   2.  | Post   | /user/new         | createNewUser     | users      | Insert/create new user record   |
        ---------------------------------------------------------------------------------------------------------
*/

/* importing required files and packages */
const express = require('express');
const router = express.Router();
const data = require('../../data');
const usersData = data.users;
const credentialsData = data.credentials;
const passport = require('../../config/passport-users');


// check user authenticity
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        return next();
    }
}

//------------------------ route to render to create new user form
router.get('/', (req, res) => {
    res.render('payment/payment-confirmation', {
		userName: "Paras",
		orderId: 4545232,
		transactionId: 124542322343
	});
});

// exporting routing apis
module.exports = router;