/* 
 * Users Routers * 
 * Users Data Access Object *
 * Create User *

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
const xss = require('xss');
const validator = require('validator');
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

//------------------------ route to render to create new user form
router.get('/', isLoggedIn, (req, res) => {
    res.render('users/auth/create-new-account', {
        mainTitle: "Create an Account •"
    });
});

//------------------------ route to create new user into database
router.post('/', (req, res) => {
    let newUser = req.body;

    // checking null values
    if(!newUser.name) {
        res.render('users/auth/create-new-account', { 
            mainTitle: "Create an Account •",
            error: "Please provide your name." 
        });
        return;
    } else if (!newUser.email) {
        res.render('users/auth/create-new-account', {
            mainTitle: "Create an Account •",
            error: "Please provide your email id."
        });
        return;
    } else if (!newUser.mobile) {
        res.render('users/auth/create-new-account', {
            mainTitle: "Create an Account •",
            error: "Please provide your contact number."
        });
        return;
    } else if (!newUser.password) {
        res.render('users/auth/create-new-account', {
            mainTitle: "Create an Account •",
            error: "Please provide your account password." 
        });
        return;
    }

    // validating email syntax
    if (!validator.isEmail(newUser.email)) {
        res.render('users/auth/create-new-account', {
            mainTitle: "Create an Account •",
            error: "Invalid email id format."
        });
        return;
    }

    // searching for an existing user
    usersData.getUserById(xss(newUser.email)).then((userJsonDocument) => {

        if (userJsonDocument == null) {     // validating received document whether user exist or not
            usersData.createNewUser(xss(newUser.name), xss(newUser.email), xss(newUser.mobile)).then((createUserDocument) => {
                credentialsData.createNewCredential(xss(newUser.email), xss(newUser.password)).then((userCredential) => {
                            
                    let user = {    // create 'user' object
                        email: newUser.email,
                        password: newUser.password
                    }

                    passport.authenticate('user')(req, res, function () {   //authenticate user
                        res.json({ success: true });
                    });
                    
                });
            });
        } else {    // rendering error page if user already exists
            res.render('users/auth/create-new-account', {
                mainTitle: "Create an Account •",
                error: "This email id is already registered."
            });
        }       
    })
    .catch((error) => {   // rendering error page
        res.render('alerts/error', {
            mainTitle: "Server Error •",
            code: 500,
            message: error,
            url: req.originalUrl
        });
    });
});

// exporting routing apis
module.exports = router;