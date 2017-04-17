/* 
 * Users Routers *
 * Users Login *
 * This route file contains apis to check authenticity of a user
 * Functionalities Index: 
        ===================================================================================================
        | S.No. |  Type  |        URL        |   Function Call   | Controller |       Description         |
        ===================================================================================================
        |   1.  | Get    | /user/login       | ***               | ***        | Search user from it's id  |
        ---------------------------------------------------------------------------------------------------
        |   2.  | Get    | /user/info/list   | getAllUsers       | users      | Search all user info      |
        ---------------------------------------------------------------------------------------------------
*/

/* importing required files and packages */
const express = require('express');
const router = express.Router();
const data = require('../../../data');
const usersData = data.users;
const credentialsData = data.credentials;
const passport = require('../../../config/passportUsers');


// checking user authenticity
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        return next();
    }
}

// route to fetch user information by id
router.get('/', isLoggedIn, (req, res) => {
    req.flash('loginFlash');

console.log(req.session.flash)

	if (req.session.flash["error"] === undefined) {
        res.render('users/login', { error: req.session.flash.error });   
    } else {
        res.render('users/login', { error: req.session.flash.error.slice(-1)[0] });
    }
});

// routing for login form submit
router.post('/',
    passport.authenticate('local', { 
        successRedirect: '/', 
        failureRedirect: '/user/login', 
        failureFlash: true 
    })
);

/* route to fetch information for all users 
router.post('/', (req, res) => {
	let userLogin = req.body;

	// checking null values
    if(!userLogin.email) {
        res.render('alerts/error', {
			code: 400,
			message: `Please provide your email id.`,
			url: req.originalUrl
        });
        return;
    } else if (!userLogin.password) {
        res.render('alerts/error', {
			code: 400,
			message: `Please provide your password.`,
			url: req.originalUrl
        });
        return;
    }

	// searching for an existing user
	usersData.getUserById(userLogin.email).then((userDocument) => {

		// validating received user information
        if (userDocument != null) {
            credentialsData.compareCredential(userLogin.email, userLogin.password).then((loginsuccess) => {
				res.render('alerts/success', {
					code: 200,
					message: loginsuccess,
					url: req.originalUrl
				});

			}, () => {
				res.render('alerts/error', {
					code: 400,
					message: "Incorrect Password",
					url: req.originalUrl
				});
			})
        } else {
            res.render('alerts/error', { 
                code: 400,
                message: `User is not registered.`,
                url: req.originalUrl
            });
        }

	}).catch((collectionError) => {
        res.render('alerts/error', {
            code: 500,
            message: collectionError,
            url: req.originalUrl
        });
    });
});
*/

// exporting routing apis
module.exports = router;