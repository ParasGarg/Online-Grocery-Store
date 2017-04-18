/* 
 * Users Routers *
 * Users Login *
 * This route file contains apis to check authenticity of a user
 * Functionalities Index: 
        =============================================================================================================
        | S.No. |  Type  |        URL        |   Function Call   |  Controller |       Description                  |
        =============================================================================================================
        |   1.  | Get    | /user/login       | ***               | ***         | Render a user login page           |
        -------------------------------------------------------------------------------------------------------------
        |   2.  | Post   | /user/login       | compareCredential | credentials | Operations for user authentication |
        -------------------------------------------------------------------------------------------------------------
*/

/* importing required files and packages */
const express = require('express');
const router = express.Router();
const data = require('../../../data');
const usersData = data.users;
const credentialsData = data.credentials;
const passport = require('../../../config/passportUsers');


// check user authenticity
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        return next();
    }
}

// route to fetch user information by email id
router.get('/', isLoggedIn, (req, res) => {
    req.flash('loginFlash');

	if (req.session.flash["error"] === undefined) {
        res.render('users/login', { error: req.session.flash.error });   
    } else {
        res.render('users/login', { error: req.session.flash.error.slice(-1)[0] });
    }
});

// routing for login form submit
router.post('/',
    passport.authenticate('user', { 
        successRedirect: '/', 
        failureRedirect: '/user/login', 
        failureFlash: true 
    })
);

// exporting routing apis
module.exports = router;