/* 
 * Users Routers *
 * This route file contains all apis for basic user operations
 * Functionalities Index: 
        ===================================================================================================
        | S.No. |  Type  |        URL        |   Function Call   | Controller |       Description         |
        ===================================================================================================
                                                --- OPERATIONS ---
        ---------------------------------------------------------------------------------------------------
        |   1.  | Get    | /user/info/:id    | getUserById       | users      | Search user from it's id  |
        ---------------------------------------------------------------------------------------------------
        |   2.  | Get    | /user/new         | createNewUser     | ***        | Page for new user form    |
        ---------------------------------------------------------------------------------------------------
        |   3.  | Post   | /user/new         | createNewUser     | users      | Insert new user record    |
        ---------------------------------------------------------------------------------------------------
        |   4.  | Get    | /user/update/:id  | updateUserProfile | ***        | Page for update user form |
        ---------------------------------------------------------------------------------------------------
        |   5.  | Put    | /user/update/:id  | updateUserProfile | users      | Update user profile info  |
        ---------------------------------------------------------------------------------------------------
                                                --- LOGIN / LOGOUT---
        ---------------------------------------------------------------------------------------------------
        |   6.  | Put    | /user/update/:id  | updateUserProfile | users      | Update user profile info  |
        ---------------------------------------------------------------------------------------------------
        |   7.  | Put    | /user/update/:id  | updateUserProfile | users      | Update user profile info  |
        ---------------------------------------------------------------------------------------------------
        |   8.  | Put    | /user/update/:id  | updateUserProfile | users      | Update user profile info  |
        ---------------------------------------------------------------------------------------------------        
*/

/* importing required files and packages */
const express = require('express');
const router = express.Router();
const data = require('../data');
const usersData = data.users;
const credentialsData = data.credentials;
const userPassport = require('../config/passport');

// route to fetch user information by id
router.get('/info/:id', (req, res) => {
    usersData.getUserById(req.params.id).then((userJsonDocument) => {
 
        // validating received user information
        if (userJsonDocument == null) {
            res.render('alerts/error', {
                code: 400,
                message: `User with '${req.params.id}' email id is not a registered user.`,
                url: req.originalUrl
            });
        } else {
            res.json(userJsonDocument);
        }
    }).catch((collectionError) => {
        res.render('alerts/error', { 
            code: 500,
            message: collectionError,
            url: req.originalUrl
        });
    });
});

// route to render to create new user form
router.get('/new', (req, res) => {
    res.render('alerts/success', { message: "Page for create user form" });
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
                    res.render('alerts/error', { 
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
                            res.render('alerts/error', { 
                                code: 400,
                                message: `Credential with '${newUser.email}' email id is already a registered.`,
                                url: req.originalUrl
                            });
                        }
                    });
                }
            });
        } else {    // user document found
            res.render('alerts/error', { 
                code: 400,
                message: `User with '${newUser.email}' email id is already a registered.`,
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

// route to render to update user form
router.get('/update/:id', (req, res) => {
    res.render('alerts/success', { message: "Page for update a user form" });
});

// route to update user information by id
router.put('/update/:id', (req, res) => {
    let userUpdates = req.body;

    // checking for empty json
    if (Object.keys(userUpdates).length === 0) {
        res.render('alerts/error', {
            code: 400,
            message: `No data is provided to update the user information.`,
            url: req.originalUrl
        });
    } else  {
        // validating user existance
        usersData.getUserById(req.params.id).then((userJsonDocument) => {
            credentialsData.getCredentialById(req.params.id).then((credentialJsonDocument) => {
                   
                // user not exist
                if (userJsonDocument == null || credentialJsonDocument == null) {     // user document exists
                    res.render('alerts/error', {
                        code: 400,
                        message: `User and credentials with '${req.params.id}' email id does not exists.`,
                        url: req.originalUrl
                    });
                } else {
                    // checking for user profile updates
                    if (userUpdates.name || userUpdates.mobile || userUpdates.image) {
                        // update new json document in users collection for user profile
                        usersData.updateUserProfile(req.params.id, userUpdates).then((profileUpdates) => {
                            // validating updates
                            if (profileUpdates == null) {
                                res.render('alerts/error', {
                                    code: 400,
                                    message: `User with '${req.params.id}' email id does not exists.`,
                                    url: req.originalUrl
                                });
                            }
                        }, (collectionError) => {
                            res.render('alerts/error', {
                                code: 500,
                                message: collectionError,
                                url: req.originalUrl
                            });
                        });
                    }

                    // checking for user security updates
                    if (userUpdates.password) {
                        // update new json document in credentials collection for user password
                        credentialsData.updateCredential(req.params.id, userUpdates.password).then((credentialUpdate) => {
                            // validating updates
                            if (credentialUpdate == null) {
                                res.render('alerts/error', {
                                    code: 400,
                                    message: `User with '${req.params.id}' email id does not exists.`,
                                    url: req.originalUrl
                                });
                            }                            
                        }, (collectionError) => {
                            res.render('alerts/error', {
                                code: 500,
                                message: collectionError,
                                url: req.originalUrl
                            });
                        });
                    }

                    // checking for user payment updates
                    if (userUpdates.paymentMode || userUpdates.paymentInfo || userUpdates.wallet) {

                        /*
    **********************
    **********************  INSERT CODE FOR UPDATE OF USER PAYMENT OPTIONS
    **********************
                        */
                    }

                    res.render('alerts/success', {
                        code: 200,
                        message: "Yay! User profile updated!",
                        url: req.originalUrl
                    });
                }
            // error checking for credentials collection
            }, (collectionError) => {
                res.render('alerts/error', {
                    code: 500,
                    message: collectionError,
                    url: req.originalUrl
                });
            });
        // error checking for users collection
        }, (collectionError) => {
            res.render('alerts/error', {
                code: 500,
                message: collectionError,
                url: req.originalUrl
            });
        });
    }
});

// exporting routing apis
module.exports = router;