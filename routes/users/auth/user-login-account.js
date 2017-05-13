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
const validator = require('validator');
const data = require('../../../data');
const usersData = data.users;
const credentialsData = data.credentials;
const passport = require('../../../config/passport-users');
const emailToLowerCase = require('../comp/email-case-converter').emailToLowerCase;

/* local scoped function */
//------ user authentication validation
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
        res.redirect('/user/dashboard');
    } else {
        return next();
    }
}

//------ user email validation
function isValid(req, res, next) {
    let email = emailToLowerCase(xss(req.body.email));
    let password = xss(req.body.password);

    if (email.length == 0) {
        res.status(404).send({ error: "No email id provided" });
    } else if (password.length == 0) {
        res.status(404).send({ error: "No password provided" });
    }

    // validating email syntax
    if (!validator.isEmail(email)) {
        res.status(404).send({ error: "Invalid email id format." });
        return;
    }

    credentialsData.getCredentialById(email).then((userCredentials) => {
        if (userCredentials == null) {      // no user document found
            res.status(404).send({ error: "This email id is not registered" });
        } else {    // document found and comparing credentials
            credentialsData.compareCredential(email, password)
                .then(() => {
                    next();     // sent for user authentication
                })
                .catch((error) => {     // credentials mismatched error
                    res.status(400).send({ error: "Incorrect password" });
                });
        }
    });
}

/* global scoped function */
//------------------------ route to fetch user information by email id
router.get('/', isLoggedIn, (req, res) => {
    req.flash('loginFlash');

	if (req.session.flash["error"] === undefined) {
        res.render('users/auth/user-login-account', { 
            mainTitle: "Dashboard Login •",
            url: '/user/dashboard',
            error: req.session.flash.error 
        });
    } else {
        res.render('users/auth/user-login-account', { 
            mainTitle: "Dashboard Login •",
            error: req.session.flash.error.slice(-1)[0] 
        });
    }
});

//------------------------ routing for login form submit
router.post('/', isValid, (req, res) => {
    let user = {    // create 'user' object
        email: emailToLowerCase(xss(req.body.email)),
        password: xss(req.body.password)
    }

    passport.authenticate('user')(req, res, function () {   //authenticate user
        res.json({ success: true, url: req.url });
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