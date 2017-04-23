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

//------ user email verification
function isRegistered(req, res, next) {

	let email = xss(req.body.email);
	
    credentialsData.getCredentialById(email)
		.then((userCredentials) => {
	
			if (userCredentials == null) {  // no user document found, then sending 404 status
				res.status(404).send({ error: "This email id is not registered" });
			} 
			
		})
		.then(() => {
			credentialsData.generateCredential(email).then((genPass) => {
				req.body["password"] = genPass;
				next();
			});
		})
		.catch((error) => { // credentials mismatched, then sending 400 status
			res.json({ error: error });
		});
}

//------------------------ route to fetch user information by email id
router.get('/', isLoggedIn, (req, res) => {
	res.render('users/auth/user-forget-password');
});

//------------------------ routing for login form submit
router.post('/', isRegistered, (req, res) => {
    res.json(req.body);
});

// exporting routing apis
module.exports = router;