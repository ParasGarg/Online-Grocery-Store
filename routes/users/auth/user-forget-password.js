/* 
 * Users Routers * 
 * Users Authentication *
 * Users Forget Password *

 * Functionalities Index: 
        ==============================================================================================================
        | S.No. |  Type  |          URL          |    Function Call   |  Controller |       Description              |
        ==============================================================================================================
        |   1.  | Get    | /user/forget-password | ***                | ***         | Render a user login page       |
        --------------------------------------------------------------------------------------------------------------
        |   2.  | Post   | /user/forget-password | generateCredential | credentials | Generate password              |
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

//------ user email verification
function isValid(req, res, next) {
	let email = emailToLowerCase(xss(req.body.email));
	
	if (email.length == 0) {
        res.status(404).send({ error: "No email id provided" });
    }

	// validating email syntax
    if (!validator.isEmail(email)) {
        res.status(404).send({ error: "Invalid email id format." });
        return;
    }

    credentialsData.getCredentialById(email).then((userCredentials) => {
        if (userCredentials == null) {  	// no user document found
            res.status(404).send({ error: "This email id is not registered" });
        } else {
            next();
        }
    })
    .catch((error) => { 	// credentials mismatched error
        res.json({ error: error });
    });
}

/* global scoped function */
//------------------------ route to fetch user information by email id
router.get('/', isLoggedIn, (req, res) => {
	res.render('users/auth/user-forget-password', {
		mainTitle: "Forgot Password •",
	});
});

//------------------------ routing for login form submit
router.post('/', isValid, (req, res) => {
    let email = emailToLowerCase(xss(req.body.email));

    // generating new random password
    credentialsData.generateCredential(email).then((genPass) => {
        req.body["password"] = genPass;
        res.json(req.body);
	});
});

// exporting routing apis
module.exports = router;