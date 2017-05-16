/* 
 * Users Routers * 
 * Users Data Access Object *
 * User Cart *

 * Functionalities Index: 
        =======================================================================================================
        | S.No. |  Type  |         URL         |    Function Call   | Controller |         Description        |
        =======================================================================================================
        |   1.  | Post   | /user/update/cart   | addItemInCart      | usersCart  | Insert new cart record     |
        -------------------------------------------------------------------------------------------------------
        |   2.  | Delete | /user/update/cart   | deleteItemFromCart | usersCart  | Delete a saved cart record |
        -------------------------------------------------------------------------------------------------------
*/
/* importing required files and packages */
const express = require('express');
const router = express.Router();
const xss = require('xss');
const data = require('../../../data');
const usersData = data.users;
const usersCartData = data.usersCart;
const productData = data.products;
const passport = require('../../../config/passport-users');

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
//------------------------ route to update user information by id
router.get('/', isLoggedIn, (req, res) => {
	res.render('alerts/error', {
		mainTitle: "Bad Request •",
		code: 400,
		message: "No such product exists",
		url: req.originalUrl,
		user: req.user
	});
});

// exporting routing apis
module.exports = router;