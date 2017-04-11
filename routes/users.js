/* 
 * Users Routers *
 * This route file contains all apis for basic user operations
 * Functionalities Index: 
        =======================================================================================
        | S.No. |  Type  |    URL    |   Function Call   | Fn Path |       Description        |
        =======================================================================================
        |   1.  | Get    | /user/:id | getUserById       | users   | Search user from it's id |
        ---------------------------------------------------------------------------------------
        |   2.  | Post   | /user/new | createNewUser     | users   | Insert new user record   |
        ---------------------------------------------------------------------------------------
        |   3.  | Put    | /user/:id | updateUserProfile | users   | Update user profile info |
        ---------------------------------------------------------------------------------------
*/

/* importing required files and packages */
const express = require('express');
const router = express.Router();
const data = require('../data');
const usersData = data.users;
const credentialsData = data.credentials;

// route to fetch user information by id
router.get('/:id', (req, res) => {
    usersData.getUserById(req.params.id).then((userJsonDocument) => {
 
        // validating received user information
        if (userJsonDocument == null) {
            res.render('errors/index', {
                code: 400,
                message: `User with '${req.params.id}' email id is not a registered user.`,
                url: req.originalUrl
            });
        } else {
            res.json(userJsonDocument);
        }
    }).catch((collectionError) => {
        res.render('errors/index', { 
            code: 500,
            message: collectionError,
            url: req.originalUrl
        });
    });
});

// route to create new user into database
router.post('/new', (req, res) => {
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
    }  else if (!newUser.image) {
        newUser.image = null;
    }

    // searching for an existing user
    usersData.getUserById(newUser.email).then((userJsonDocument) => {

        // validating received user information
        if (userJsonDocument == null) {
            // creating new json document in users collection 
            usersData.createNewUser(newUser.name, newUser.email, newUser.mobile, newUser.image).then((createUserDocument) => {

                // validating received user information
                if (createUserDocument == null) {
                    res.render('errors/index', { 
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
                                res.status(200).json(userCredential);
                            });
                        } else {   // user document found
                            res.render('errors/index', { 
                                code: 400,
                                message: `Credential with '${newUser.email}' email id is already a registered.`,
                                url: req.originalUrl
                            });
                        }
                    });
                }
            });
        } else {    // user document found
            res.render('errors/index', { 
                code: 400,
                message: `User with '${newUser.email}' email id is already a registered.`,
                url: req.originalUrl
            });
        }
    }).catch((collectionError) => {
        res.render('errors/index', {
            code: 500,
            message: collectionError,
            url: req.originalUrl
        });
    });
});

// rute to update user information by id
router.put('/:id', (req, res) => {
    let userUpdates = req.body;

    // checking for empty json
    if (Object.keys(userUpdates).length === 0) {
        res.render('errors/index', {
            code: 400,
            message: `No data is provided to update the user information.`,
            url: req.originalUrl
        });
    } else  {
        // validating user existance
        usersData.getUserById(req.params.id).then((userJsonDocument) => {
            // user not exist
            if (userJsonDocument == null) {     // user document exists
                res.render('errors/index', {
                    code: 400,
                    message: `User with '${req.params.id}' email id does not exists.`,
                    url: req.originalUrl
                });
            } else {
                // checking for user profile updates
                if (userUpdates.name || userUpdates.mobile || userUpdates.image) {
                    // update new json document in users collection for user profile
                    usersData.updateUserProfile(req.params.id, userUpdates).then((profileUpdates) => {
                        // validating updates
                        if (profileUpdates == null) {
                            res.render('errors/index', {
                                code: 400,
                                message: `User with '${req.params.id}' email id does not exists.`,
                                url: req.originalUrl
                            });
                        }
                    });
                }

                // checking for user security updates
                if (userUpdates.password) {

                }

                // checking for user payment updates
                if (userUpdates.paymentMode || userUpdates.paymentInfo) {

                }

                // checking for user wallet updates
                if (userUpdates.wallet) {

                }


                        res.status(200).json(updates);


            }
        }, (collectionError) => {
            res.render('errors/index', {
                code: 500,
                message: collectionError,
                url: req.originalUrl
            });
        });
    }
});

// exporting routing apis
module.exports = router;