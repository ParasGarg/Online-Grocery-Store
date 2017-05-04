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

	let wallet = xss(req.body.amount);
	let email = xss(req.user._id);

	if (Object.keys(wallet).length === 0 || wallet == undefined) {    // check for empty json passed
		res.render("users/gui/user-wallet", {
			mainTitle: "Bad Request •",
			code: 400,
			message: `No data has been provided for update.`,
			url: req.originalUrl
		});
	} else if (!wallet) {
		res.status(400).json({ error: "No amount provided" });
	} 

	// checking for user wallet updates
	usersWalletData.addCash(email, JSON.parse(wallet)).then((walletInfo) => {
		req.user.wallet = walletInfo.wallet;
		res.json(req.user.wallet);
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