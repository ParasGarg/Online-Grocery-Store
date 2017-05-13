/* importing required files and packages */
const express = require('express');
const router = express.Router();
const xss = require('xss');
const data = require('../../data');
const usersData = data.users;
const usersCartData = data.usersCart;
const passport = require('../../config/passport-users');

/* local scoped function */
//------ user authentication validation
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.render('users/auth/user-login-account', {
			mainTitle: "User Login •",
			url: `/user/dashboard/cart`
		});
	}
}

/* global scoped function */
//------------------------ route to Checkout
router.get('/', (req, res) => {
	res.render('alerts/error', {
		mainTitle: "Page Not Found •",
		code: 404,
		message: `Not Allowed`,
		url: req.originalUrl,
		user: req.user
	});
});

//------------------------ route to Checkout
router.post('/', isLoggedIn, (req, res) => {
	usersData.getUserById(xss(req.user._id)).then((userInfo) => {
		
		if(userInfo != null) {
			req.user = userInfo;

			let totalCost = 0;
			let taxes = 0;
			let netCost = 0;
			for (var i = 0; i < userInfo.cart.length; i++) {
				totalCost += (userInfo.cart[i].price * userInfo.cart[i].qty);
			}

			totalCost = Math.round(totalCost * 100) / 100;
			taxes = Math.round(totalCost * 0.07 * 100) / 100;
			netCost = Math.round((totalCost + taxes) * 100) / 100;

			let wFlag = true;
			if (userInfo.wallet < netCost) {
				wFlag = false;
			}

			res.render('payment/payment-gateway', {
				mainTitle: "Checkout •",
				user: req.user,
				total: totalCost,
				tax: taxes,
				net: netCost,
				isWallet: wFlag 
			});
		} else {
			res.render('alerts/error', {
				mainTitle: "Page Not Found •",
				code: 404,
				message: `Page Not Found`,
				url: req.originalUrl,
				user: req.user
			});
		}
	});
});

// exporting routing apis
module.exports = router;