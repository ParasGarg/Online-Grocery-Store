/* 
 * Users Routers *
 * Users Info *
 * This route file contains apis to fetch user information
 * Functionalities Index: 
        ===================================================================================================
        | S.No. |  Type  |        URL        |   Function Call   | Controller |       Description         |
        ===================================================================================================
        |   1.  | Get    | /user/info/:id    | getUserById       | users      | Search user from it's id  |
        ---------------------------------------------------------------------------------------------------
*/

/* importing required files and packages */
const express = require('express');
const router = express.Router();
const data = require('../../../data');
const usersData = data.users;
const passport = require('../../../config/passportUsers');


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

// route to fetch user information by email id
router.get('/:email', isLoggedIn, (req, res) => {

    // validating for inquired user and logged in user
    // inquired user and logged in user must be same to access information details
    if (req.user._id === req.params.email) {
        // fetching user information
        usersData.getUserById(req.params.email).then((userJsonDocument) => {
 
            // validating received user information
            if (userJsonDocument != null) {
                // responding to query with user information
                res.json(userJsonDocument);                
            } else {
                // this never would be the case as user authenticity and existance has been checked before
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

    } else {
        // rendering error page if inquired user and logged in user is not same
        res.render('alerts/error', {
            code: 401,
            message: `You are not allowed to access this page.`,
            url: req.originalUrl
        });
    }
});

// exporting routing apis
module.exports = router;