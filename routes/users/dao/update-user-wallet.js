/* 
 * Users Routers * 
 * Users Data Access Object *
 * User Wallet *

 * Functionalities Index: 
        ======================================================================================================
        | S.No. |  Type  |         URL         |   Function Call   | Controller |         Description        |
        ======================================================================================================
        |   1.  | Post   | /user/update/wallet | addCash           | usersCard  | Insert new card record     |
        ------------------------------------------------------------------------------------------------------
*/

/* importing required files and packages */
const express = require('express');
const router = express.Router();
const xss = require('xss');
const data = require('../../../data');
const usersData = data.users;
const usersWalletData = data.usersWallet;
const walletTransaction = data.transactionWallet;
const passport = require('../../../config/passport-users');

/* local scoped function */
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

/* global scoped function */
//------------------------ route to update user information by id
router.post('/', isLoggedIn, (req, res) => {

	let email = xss(req.user._id);
	let amount = xss(req.body.amount);
	let cardUsed = xss(req.body.cardUsed);
	let status = xss(req.body.action);
	let remark = xss(req.body.description);

	if (Object.keys(amount).length === 0 || amount == undefined) {    // check for empty json passed
		res.render("users/gui/user-wallet", {
			mainTitle: "Bad Request •",
			code: 400,
			message: `No data has been provided for update.`,
			url: req.originalUrl
		});
	} else if (!amount) {
		res.status(400).json({ error: "No amount provided" });
	} 

	// checking for user wallet updates
	usersWalletData.addCash(email, JSON.parse(amount)).then((walletInfo) => {
		walletTransaction.logTransaction(email, amount, cardUsed, status, remark).then((transactions) => {		// logging transaction
			
			req.user.wallet = walletInfo.wallet;
			let transactionsList = transactions.reverse();

			let data = {
				amount: walletInfo.wallet,
				transactions: transactionsList
			}

			res.json(data);
		
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