/* 
 * Payments Routers *
 * Gateway *
 * This route file contains apis for payment gateway operations
 * Functionalities Index: 
        =====================================================================================================================
        | S.No. |  Type  |        URL        |   Function Call   | Controller |                 Description                 |
        =====================================================================================================================
        |   1.  | Get    | /payment/gateway  | createNewUser     | ***        | Render a page for gateway form              |
        ---------------------------------------------------------------------------------------------------------------------
        |   2.  | Post   | /payment/gateway  | createNewUser     | payments   | Create new order and transction id for user |
        ---------------------------------------------------------------------------------------------------------------------
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
    res.render('payment/payment-gateway', {
		mainTitle: "Payment Gateway",
        userName: "Paras",
		orderId: 4545232,
		transactionId: 124542322343
	});
});

// exporting routing apis
module.exports = router;