/* 
 * Users Routers *
 * Users Logout *
 * This route file contains apis to discard authenticity of a user
 * Functionalities Index: 
        =============================================================================================================
        | S.No. |  Type  |        URL        |   Function Call   |  Controller |       Description                  |
        =============================================================================================================
        |   1.  | Get    | /user/logout      | ***               | ***         | Redirect to login page             |
        -------------------------------------------------------------------------------------------------------------
        |   2.  | Post   | /user/logout      | ***               | ***         | Delete user session                |
        -------------------------------------------------------------------------------------------------------------
*/

/* importing required files and packages */
const express = require('express');
const router = express.Router();
const passport = require('../../../config/passportUsers');
const passportLogout = require('express-passport-logout');


// check user authenticity
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        return next();
    }
}

// route to fetch user information by id
router.get('/', isLoggedIn, (req, res) => {
	res.redirect('/user/login');	
});

// routing for login form submit
router.post('/', (req, res) => {
	req.logOut();
	res.redirect('/user/login');
});

// exporting routing apis
module.exports = router;