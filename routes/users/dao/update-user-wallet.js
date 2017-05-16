/* 
 * Users Routers * 
 * Users Data Access Object *
 * User Wallet *

 * Functionalities Index: 
        ========================================================================================================================
        | S.No. |  Type  |         URL         |   Function Call   | Controller |                  Description                 |
        ========================================================================================================================
        |   1.  | Put    | /user/update/wallet | addCash           | usersCard  | Update wallet amount without payment gateway |     |
        ------------------------------------------------------------------------------------------------------------------------
		|   2.  | Post   | /user/update/wallet | addCash           | usersCard  | Update wallet amount with payment gateway    |
        ------------------------------------------------------------------------------------------------------------------------
        
*/

/* importing required files and packages */
const express = require('express');
const router = express.Router();
const xss = require('xss');
const data = require('../../../data');
const usersData = data.users;
const usersCardData = data.usersCard;
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
			url: req.originalUrl,
			user: req.user
		});
	}
}

/* global scoped function */
//------------------------ route to quickly update wallet amount by user id without payment gatewaty
router.put('/', isLoggedIn, (req, res) => {

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
	} else if (!cardUsed) {
		res.status(400).json({ error: "No card details provided" });
	} else if (!status || !remark) {
		res.status(400).json({ error: "Something went wrong. Please try again" });
	}

	// checking for user wallet updates
	usersCardData.getCardByIds(email, cardUsed).then((cardInfo) => {

		let cardData = {
			name: cardInfo.name,
			number: cardInfo._id,
			type: cardInfo.type,
			expiry: cardInfo.expiry,
			//issuer: cardInfo.issuer,
			cvv: cardInfo.cvv
		}

		usersWalletData.addCash(email, JSON.parse(amount)).then((walletInfo) => {
			if (walletInfo == false){
				res.json({ success: false, error: "Total wallet limit exceed. Maximum $10000 are allowed." })
			} else if (walletInfo) {
				walletTransaction.logTransaction(email, amount, cardData, status, remark).then((transactions) => {		// logging transaction
					
					req.user.wallet = walletInfo.wallet;
					let transactionsList = transactions.reverse();

					let data = {
						amount: walletInfo.wallet,
						success: true,
						transactions: transactionsList
					}

					res.json(data);
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
});

//------------------------ route to quickly update wallet amount by user id with payment gatewaty
router.post('/', isLoggedIn, (req, res) => {

	let email = xss(req.user._id);
	let amount = xss(req.body.amount);
	let cardData = {
		name: xss(req.body.cardName),
		number: xss(req.body.cardNumber),
		type: xss(req.body.cardType),
		expiry: `${xss(req.body.cardMonth)}/${xss(req.body.cardYear)}`,
		//issuer: xss(req.body.cardBrand),
		cvv: xss(req.body.cardCVV)
	};
	let status = "Credit";
	let remark = "Added cash in wallet";

	if (Object.keys(amount).length === 0 || amount == undefined) {    // check for empty json passed
		res.status(400).json({ error: "No wallet details provided provided" });
	} else if (!amount) {
		res.status(400).json({ error: "No amount provided" });
	} else if (!cardData.name) {
		res.status(400).json({ error: "No card name provided" });
	} else if (!cardData.number) {
		res.status(400).json({ error: "No card number provided" });
	} else if (!cardData.type) {
		res.status(400).json({ error: "No card type provided" });
	} else if (!cardData.expiry) {
		res.status(400).json({ error: "No expiry provided" });
	}/* else if (!cardData.issuer) {
		res.status(400).json({ error: "No card issuer provided" });
	}*/ else if (!cardData.cvv) {
		res.status(400).json({ error: "No card CVV provided" });
	} 

	// checking for user wallet updates
	usersWalletData.addCash(email, JSON.parse(amount)).then((walletInfo) => {

		if (walletInfo == false){
			res.render('alerts/error', {
				mainTitle: "Bad Request •",
				code: 400,
				message: "Total wallet limit exceed. Maximum $10000 are allowed.",
				url: req.originalUrl,
				user: req.user
			});
		} else if (walletInfo) {
			walletTransaction.logTransaction(email, amount, cardData, status, remark).then((transactions) => {		// logging transaction
			
				req.user.wallet = walletInfo.wallet;
				let transactionsList = transactions.reverse();
				let transId = transactionsList[0]._id;

				res.render('payment/payment-confirmation', {
					mainTitle: "Payment Successful •",
					user: req.user,
					redirectURL: "/user/dashboard/wallet",
					amount: amount,
					transactionId: transId
				});
			});
		}
	})
	.catch((error) => {     // rendering error page
		res.render('alerts/error', {
			mainTitle: "Server Error •",
			code: 500,
			message: error,
			url: req.originalUrl,
			user: req.user
		});
	});
});

// exporting routing apis
module.exports = router;