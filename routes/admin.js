/*
 * Admin Routers *
 * This route file contains all apis for admin operations
 * Functionalities Index:
        ========================================================================================================
        | S.No. |  Type  |         URL        |   Function Call   |    Fn Path    |         Description        |
        ========================================================================================================
        |   1.  | Get    | /admin/users/      | getUserById       | users         | Search user from it's id   |
        --------------------------------------------------------------------------------------------------------
        |   2.  | Get    | /admin/users/list  | getAllUsers       | users         | Search all users           |
        --------------------------------------------------------------------------------------------------------
        |   3.  | Delete | /admin/users/:id   | deleteUser        | users         | Delete a user record       |
        --------------------------------------------------------------------------------------------------------
        |   4.  | Delete | /admin/creds/:id   | deleteCredential  | credentials   | Delete a credential record |
        --------------------------------------------------------------------------------------------------------
*/

/* importing required files and packages */
const express = require('express');
const router = express.Router();
const data = require('../data');
const usersData = data.users;
const credentialsData = data.credentials;

/* routes for user collection operations */
// route to fetch user information by id
router.get('/user/info/:id', (req, res) => {
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

// route to fetch information for all users 
router.get('/user/list', (req, res) => {
    usersData.getAllUsers().then((userJsonDocumentList) => {

        // validating received user information
        if (userJsonDocumentList == null) {
            res.render('alerts/error', { 
                code: 400,
                message: `No user is registered.`,
                url: req.originalUrl
            });
        } else {
            res.json(userJsonDocumentList);
        }

    }).catch((collectionError) => {
        res.render('alerts/error', {
            code: 500,
            message: collectionError,
            url: req.originalUrl
        });
    });
});

// route to delete user information by id
router.delete('/user/info/:id', (req, res) => {
    usersData.getUserById(req.params.id).then((userJsonDocument) => {

        // validating received user information
        if (userJsonDocument == null) {
            res.render('alerts/error', {
                code: 400,
                message: `User with '${req.params.id}' email id does not exist.`,
                url: req.originalUrl
            });
        } else {
            // deleting user
            usersData.deleteUser(req.params.id).then(() => {
                // deleting user credentails
                credentialsData.deleteCredential(req.params.id).then(() => {
                    res.status(200).send(`User and its credentials with ${req.params.id} email id has been deleted`);
                
                }, (noResultError) => {
                    res.render('alerts/error', {
                        code: 400,
                        message: noResultError,
                        url: req.originalUrl
                    });
                });
            
            }, (noResultError) => {
                res.render('alerts/error', {
                    code: 400,
                    message: noResultError,
                    url: req.originalUrl
                });
            });
        }
    }, (collectionError) => {
        res.render('alerts/error', {
            code: 500,
            message: collectionError,
            url: req.originalUrl
        });
    });
});

/*
// route to fetch information for all users 
router.get('/list', (req, res) => {
    usersData.getAllUsers().then((usersJsonDocumentList) => {

        // validating received user information
        if (usersJsonDocumentList == null) {
            res.render('alerts/error', { 
                code: 400,
                message: `No user is registered.`,
                url: req.originalUrl
            });
        } else {
            res.json(usersJsonDocumentList);
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

// route to delete credential information by id
router.delete('/user/credential/:id', (req, res) => {
    credentialsData.getCredentialById(req.params.id).then((credentialJsonDocument) => {

        // validating received credentails information
        if (credentialJsonDocument == null) {
            res.render('alerts/error', { 
                code: 400,
                message: `Credential with '${req.params.id}' email id does not exists.`,
                url: req.originalUrl
            });
        } else {
             // deleting credentials
            credentialsData.deleteCredential(req.params.id).then(() => {
                res.status(200).send(`Credential wirh ${req.params.id} email id has been deleted`);

            }, (collectionError) => {
                res.render('alerts/error', {
                    code: 500,
                    message: collectionError,
                    url: req.originalUrl
                });
            });
        }
    }, (collectionError) => {
        res.render('alerts/error', { 
            code: 500,
            message: collectionError,
            url: req.originalUrl
        });
    });
});

// exporting routing apis
module.exports = router;