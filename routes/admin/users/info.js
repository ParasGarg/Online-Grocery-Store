/*
 * Admin Routers * Users *
 * This route file contains all apis for admin operations on users
 * Functionalities Index:
        ========================================================================================================
        | S.No. |  Type  |         URL        |   Function Call   |    Fn Path    |         Description        |
        ========================================================================================================
        |   1.  | Get    | /admin/users/      | getUserById       | users         | Search user from it's id   |
        --------------------------------------------------------------------------------------------------------
        |   2.  | Get    | /admin/users/list  | getAllUsers       | users         | Search all users           |
        --------------------------------------------------------------------------------------------------------
*/

/* importing required files and packages */
const express = require('express');
const router = express.Router();
const data = require('../../../data');
const usersData = data.users;
//const passport = require('../../../config/passportAdmin');


// check user authenticity
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
        return next();
    } else {
        // rendering error page
        res.render('alerts/error', {
            code: 401,
            message: `User is not allowed to access this page.`,
            url: req.originalUrl
        });
    }
}

//------------------------ route to fetch user information by email id
router.get('/id/:email', (req, res) => {
	// fetching user information
	usersData.getUserById(req.params.email).then((userJsonDocument) => {

		// validating received user information
		if (userJsonDocument != null) {
			// responding to query with user information
			res.json(userJsonDocument);                
		} else {
			// rendering error page
			res.render('alerts/error', {
				code: 400,
				message: `User with '${req.params.email}' email id is not a registered user.`,
				url: req.originalUrl
			});
		}
	})
	.catch((collectionError) => {
		// rendering error page
		res.render('alerts/error', { 
			code: 500,
			message: collectionError,
			url: req.originalUrl
		});
	});
});


//------------------------ route to fetch list of all users
router.get('/list', (req, res) => {
	// fetching user information
    usersData.getAllUsers().then((userJsonDocumentList) => {

        // validating received user information
        if (userJsonDocumentList != null) {
            // responding to query with user information			
            res.json(userJsonDocumentList);
        } else {
			res.render('alerts/error', { 
                code: 400,
                message: `No user is registered.`,
                url: req.originalUrl
            });
        }
    })
	.catch((collectionError) => {
		// rendering error page
		res.render('alerts/error', { 
			code: 500,
			message: collectionError,
			url: req.originalUrl
		});
	});
});

// exporting routing apis
module.exports = router;