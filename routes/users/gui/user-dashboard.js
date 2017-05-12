/* 
 * Users Routers * 
 * Users GUI *
 * Users Dashboard *

 * Functionalities Index: 
        ==========================================================================================================
        | S.No. |  Type  |            URL           |   Function Call   | Controller |       Description         |
        ==========================================================================================================
        |   1.  | Get    | /user/dashboard/         | updateUser        | users      | Page for update user form |
        ----------------------------------------------------------------------------------------------------------
*/

/* importing required files and packages */
const express = require('express');
const router = express.Router();
const data = require('../../../data');
const usersData = data.users;
const passport = require('../../../config/passport-users');

/* local function */
//------ user authentication validation
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
    res.render('users/gui/user-dashboard', {
		mainTitle: "Dashboard •",
		user: req.user
	});
});

// exporting routing apis
module.exports = router;