/* 
 * Users Routers * 
 * Users Authentication *
 * Users Login *

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
const xss = require('xss');
const data = require('../../../data');
const usersData = data.users;
const credentialsData = data.credentials;
const passport = require('../../../config/passport-users');

/* local function */
//------ user authentication validation
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
        res.redirect('/user/dashboard');
    } else {
        return next();
    }
}

//------
function isRegistered(req, res, next) {
    credentialsData.getCredentialById(xss(req.body.email)).then((userCredentials) => {
        if (userCredentials == null) {  // no user document found, then sending 404 status
            res.status(404).send({ error: "This email id is not registered" });
        } else {    // document found and comparing credentials
            credentialsData.compareCredential(xss(req.body.email), xss(req.body.password))
                .then(() => {
                    next(); // sent for authentication
                })
                .catch((error) => { // credentials mismatched, then sending 400 status
                    res.status(400).send({ error: "Incorrect password" });
                });
        }
    })
}

//------------------------ route to fetch user information by email id
router.get('/', isLoggedIn, (req, res) => {
    req.flash('loginFlash');

	if (req.session.flash["error"] === undefined) {
        res.render('users/auth/user-login', { error: req.session.flash.error });   
    } else {
        res.render('users/auth/user-login', { error: req.session.flash.error.slice(-1)[0] });
    }
});

//------------------------ routing for login form submit
router.post('/', isRegistered, (req, res) => {
    let user = {    // create 'user' object
        email: xss(req.body.email),
        password: xss(req.body.password)
    }

    passport.authenticate('user')(req, res, function () {   //authenticate user
        res.json({ success: true });
    });
});

/*
router.post('/',
    passport.authenticate('user', { 
        successRedirect: '/user/dashboard', 
        failureRedirect: '/user/login', 
        failureFlash: true 
    })
);
*/
// exporting routing apis
module.exports = router;