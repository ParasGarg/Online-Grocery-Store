/* 
 * Users Routers *
 * Users Info *
 * This route file contains apis to fetch user information
 * Functionalities Index: 
        ===================================================================================================
        | S.No. |  Type  |        URL        |   Function Call   | Controller |       Description         |
        ===================================================================================================
        |   1.  | Get    | /user/info/id/:id | getUserById       | users      | Search user from it's id  |
        ---------------------------------------------------------------------------------------------------
        |   2.  | Get    | /user/info/list   | getAllUsers       | users      | Search all user info      |
        ---------------------------------------------------------------------------------------------------
*/

/* importing required files and packages */
const express = require('express');
const router = express.Router();
const userPassport = require('../../../config/passportUsers');
const data = require('../../../data');
const usersData = data.users;

// route to fetch user information by id
router.get('/id/:id', (req, res) => {
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

// exporting routing apis
module.exports = router;