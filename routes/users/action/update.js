/* 
 * Users Routers *
 * Users Updates *
 * This route file contains apis for user information update operations
 * Functionalities Index: 
        ===================================================================================================
        | S.No. |  Type  |        URL        |   Function Call   | Controller |       Description         |
        ===================================================================================================
        |   1.  | Get    | /user/update/:id  | updateUser        | ***        | Page for update user form |
        ---------------------------------------------------------------------------------------------------
        |   2.  | Put    | /user/update/:id  | updateUser        | users      | Update user profile info  |
        ---------------------------------------------------------------------------------------------------
*/

/* importing required files and packages */
const express = require('express');
const router = express.Router();
const data = require('../../../data');
const usersData = data.users;
const credentialsData = data.credentials;
const userPassport = require('../../../config/passport');

// route to render to update user form
router.get('/:id', (req, res) => {
    res.render('users/update');
});

// route to update user information by id
router.put('/:id', (req, res) => {
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
                        usersData.updateUser(req.params.id, userUpdates).then((profileUpdates) => {
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
                    if (userUpdates.paymentMode || userUpdates.paymentInfo) {

                        /*
    **********************
    **********************  INSERT CODE FOR UPDATE OF USER PAYMENT OPTIONS
    **********************
                        */
                    }

                    // checking for user payment updates
                    if (userUpdates.wallet) {

                        /*
    **********************
    **********************  INSERT CODE FOR UPDATE OF USER WALLET
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