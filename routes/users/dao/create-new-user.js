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
const data = require('../../../data');
const usersData = data.users;
const credentialsData = data.credentials;
const passport = require('../../../config/passport-users');


// check user authenticity
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
        res.redirect('/user/dashboard');
    } else {
        return next();
    }
}

//------------------------ route to render to create new user form
router.get('/', isLoggedIn, (req, res) => {
    res.render('users/auth/create-new-account');
});

//------------------------ route to create new user into database
router.post('/', (req, res) => {
    let newUser = req.body;

    // checking null values
    if(!newUser.name) {
        res.status(400).json({ error: "Please provide your name." });
        return;
    } else if (!newUser.email) {
        res.status(400).json({ error: "Please provide your email id." });
        return;
    } else if (!newUser.mobile) {
        res.status(400).json({ error: "Please provide your contact number." });
        return;
    } else if (!newUser.password) {
        res.status(400).json({ error: "Please provide your account password." });
        return;
    }

    // searching for an existing user
    usersData.getUserById(newUser.email).then((userJsonDocument) => {

        // validating received user information
        // if user does not exists then value we get will be null
        if (userJsonDocument == null) {
            // creating new json document in users collection 
            usersData.createNewUser(newUser.name, newUser.email, newUser.mobile).then((createUserDocument) => {

                // validating received user information
                if (createUserDocument == null) {
                    // rendering error page
                    res.render('alerts/error', {
                        mainTitle: "Bad Request •",
                        code: 400,
                        message: `Invalid user input stream.`,
                        url: req.originalUrl
                    });
                    
                } else {
                     // searching for an existing credential
                    credentialsData.getCredentialById(newUser.email).then((credentialJsonDocument) => {
                        // validating received user information
                        if (credentialJsonDocument == null) {
                            // creating new json document in credentials collection 
                            credentialsData.createNewCredential(newUser.email, newUser.password).then((userCredential) => {

                                // a "user" object
                                let user = {
                                    email: newUser.email,
                                    password: newUser.password
                                }

                                // authenticating user
                                passport.authenticate('user')(req, res, function () {
                                    res.redirect('/user/dashboard');
                                });                           
                                
                            });
                        } else {
                            // rendering error page if credential already exists
                            res.render('alerts/error', {
                                mainTitle: "Bad Request •",
                                code: 400,
                                message: `Credential with '${newUser.email}' email id is already a registered.`,
                                url: req.originalUrl
                            });
                        }
                    });
                }
            });

        } else {
            // rendering error page if user already exists
            res.render('users/auth/create-new-account', {
                mainTitle: "Bad Request •",
                code: 400,
                message: `User with '${newUser.email}' email id is already a registered.`,
                url: req.originalUrl
            });
        }        
    })
    .catch((collectionError) => {
        // rendering error page
        res.render('alerts/error', {
            mainTitle: "Server Error •",
            code: 500,
            message: collectionError,
            url: req.originalUrl
        });
    });
});

// exporting routing apis
module.exports = router;