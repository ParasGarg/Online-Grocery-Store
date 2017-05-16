/* 
 * Users Routers * 
 * Users GUI *
 * Users Payment Information *
 * Users Routers for GUI/Dashboard actions *

 * Functionalities Index: 
        ===========================================================================================================
        | S.No. |  Type  |             URL           |   Function Call   | Controller |       Description         |
        ===========================================================================================================
        |   1.  | Get    | /user/dashboard/cart      | updateUser        | users      | update user cart item     |
        -----------------------------------------------------------------------------------------------------------
*/

/* importing required files and packages */
const express = require('express');
const router = express.Router();
const data = require('../../../data');
const usersData = data.users;
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

    let totalCost = 0;
    let taxes = 0;
    let netCost = 0;

    for (var i = 0; i < req.user.cart.length; i++) {
        totalCost += req.user.cart[i].total;
    }

    totalCost = Math.round(totalCost * 100) / 100;
    taxes = Math.round(totalCost * 0.07 * 100) / 100;
    netCost = Math.round((totalCost + taxes) * 100) / 100;

    res.render('users/gui/user-cart', {
		mainTitle: "Dashboard • Payment Details •",
		user: req.user,
        total: totalCost,
        tax: taxes,
        net: netCost
	});
});

// exporting routing apis
module.exports = router;