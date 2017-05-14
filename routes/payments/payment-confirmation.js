/* 
 * Users Routers * Users Configuration *
 * Create User *
 * This route file contains apis for user creation operations
 * Functionalities Index: 
        =========================================================================================================
        | S.No. |  Type  |        URL        |   Function Call   | Controller |           Description           |
        =========================================================================================================
        |   1.  | Get    | /user/new         | createNewUser     | ***        | Render a page for new user form |
        ---------------------------------------------------------------------------------------------------------
        |   2.  | Post   | /user/new         | createNewUser     | users      | Insert/create new user record   |
        ---------------------------------------------------------------------------------------------------------
*/

/* importing required files and packages */
const express = require('express');
const router = express.Router();
const data = require('../../data');
const usersData = data.users;
const credentialsData = data.credentials;
const passport = require('../../config/passport-users');


// check user authenticity
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        return next();
    }
}

//------------------------ route to render to create new user form
router.get('/', (req, res) => {
    res.render('alerts/error', {
        mainTitle: "Page Not Found •",
        code: 404,
        message: "Page Not Found",
        url: req.originalUrl,
        user: req.user
    });
});

// exporting routing apis
module.exports = router;