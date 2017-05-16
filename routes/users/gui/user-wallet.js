/* 
 * Users Routers * 
 * Users GUI *
 * Users Wallet *
 * Users Routers for GUI/Dashboard actions *

 * Functionalities Index: 
        =============================================================================================================
        | S.No. |  Type  |           URL          |   Function Call   | Controller |          Description           |
        =============================================================================================================
        |   1.  | Get    | /user/dashboard/wallet | updateUser        | users      | update user wallet info        |
        -------------------------------------------------------------------------------------------------------------
        |   2.  | Post   | /user/dashboard/wallet | ***               | ***        | Rendering payment gateway page |
        -------------------------------------------------------------------------------------------------------------
*/

/* importing required files and packages */
const express = require('express');
const router = express.Router();
const popup = require('window-popup').windowPopup;
const xss = require('xss');
const data = require('../../../data');
const usersData = data.users;
const walletTransaction = data.transactionWallet;
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

//------------------------ route to fetch user information by email id
router.get('/', isLoggedIn, (req, res) => {
    walletTransaction.getTransactionByUserId(req.user._id).then((transactions) => {
        let transactionsList = transactions.reverse().slice(0, 10);

        res.render('users/gui/user-wallet', {
            mainTitle: "Dashboard • Wallet •",
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

//------------------------ route to update wallet amount by user id through payment gatewaty
router.post('/', isLoggedIn, (req, res) => {

	let email = xss(req.user._id);
	let amount = xss(req.body.amount);
	
	if (Object.keys(amount).length === 0 || amount == undefined) {    // check for empty json passed
		res.render("users/gui/user-wallet", {
			mainTitle: "Bad Request •",
			code: 400,
			message: `No data has been provided for update.`,
			url: req.originalUrl,
			user: req.user
		});
	} else if (!amount) {
		res.status(400).json({ error: "No amount provided" });
	}

	let discountAmt = 0,
		taxesAmt = 0,
		netAmt = amount - discountAmt + taxesAmt;

	res.render('payment/add-cash-payment-gateway', {
		mainTitle: "Payment Gateway •",
		user: req.user,
		amount: amount,
		discount: discountAmt,
		taxes: taxesAmt,
		net: netAmt  
	});
});

// exporting routing apis
module.exports = router;