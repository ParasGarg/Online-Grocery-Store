/* 
 * Users Routers * 
 * Users GUI *
 * Users Orders *
 * Users Routers for GUI/Dashboard actions *

 * Functionalities Index: 
        =============================================================================================================
        | S.No. |  Type  |           URL          |   Function Call   | Controller |          Description           |
        =============================================================================================================
        |   1.  | Get    | /user/dashboard/orders | updateUser        | users      | update user wallet info        |
        -------------------------------------------------------------------------------------------------------------
        |   2.  | Post   | /user/dashboard/orders | ***               | ***        | Rendering payment gateway page |
        -------------------------------------------------------------------------------------------------------------
*/

/* importing required files and packages */
const express = require('express');
const router = express.Router();
const popup = require('window-popup').windowPopup;
const xss = require('xss');
const data = require('../../../data');
const usersData = data.users;
const orderTransaction = data.transactionOrder;
const passport = require('../../../config/passport-users');

/* local scoped functions */
//------ check user authenticity
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
    } else {
		res.render('alerts/error', {
            mainTitle: "Page Not Found •",
		    code: 404,
		    message: "Page Not Found",
            url: req.originalUrl,
			user: req.user
        });
    }
}

//------------------------ route to fetch user order information by email id
router.get('/', isLoggedIn, (req, res) => {
    orderTransaction.getTransactionByUserId(req.user._id).then((transactions) => {
        let transactionsList = transactions.reverse().slice(0, 10);
        
        res.render('users/gui/user-orders', {
            mainTitle: "Dashboard • Order History •",
            user: req.user,
            transactions: transactionsList
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
});

// exporting routing apis
module.exports = router;