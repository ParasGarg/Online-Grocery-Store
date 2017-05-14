/* 
 * Users Routers * 
 * Users Data Access Object *
 * User Card *

 * Functionalities Index: 
        ======================================================================================================
        | S.No. |  Type  |         URL         |   Function Call   | Controller |         Description        |
        ======================================================================================================
        |   1.  | Post   | /user/update/card   | addCard           | usersCard  | Insert new card record     |
        ------------------------------------------------------------------------------------------------------
        |   2.  | Delete | /user/update/card   | deleteCard        | usersCard  | Delete a saved card record |
        ------------------------------------------------------------------------------------------------------
*/
/* importing required files and packages */
const express = require('express');
const router = express.Router();
const xss = require('xss');
const data = require('../../../data');
const usersData = data.users;
const usersCardData = data.usersCard;
const passport = require('../../../config/passport-users');

/* local scoped function */
//------ user authentication validation
function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
                return next();
        } else {
                res.render('alerts/error', {
                        mainTitle: "Bad Request •",
                        code: 400,
                        message: "Unauthorized Request Attempt",
                        url: req.originalUrl,
                        user: req.user
                });
        }
}

/* global scoped function */
//------------------------ route to update user information by id
router.post('/', isLoggedIn, (req, res) => {

        let userUpdates = req.body;
        let email = xss(req.user._id);

        if (Object.keys(userUpdates).length === 0 || userUpdates == undefined) {    // check for empty json passed
                res.status(400).json({ error: "No card information provided" });
        } else if (!userUpdates.username) {
                res.status(400).json({ error: "No card holder's name provided" });
        } else if (!userUpdates.number) {
                res.status(400).json({ error: "No card number provided" });
        } else if (!userUpdates.type) {
                res.status(400).json({ error: "No card type provided" });
        }/* else if (!userUpdates.issuer) {
                res.status(400).json({ error: "No card issuer provided" });
        }*/ else if (!userUpdates.exp) {
                res.status(400).json({ error: "No card expiry provided" });
        } else if (!userUpdates.cvv) {
                res.status(400).json({ error: "No card cvv provided" });
        }
        
        usersCardData.getAllCard(email).then((cardInfo) => {

                var len = cardInfo.card.length;
                var exist = false; 

                for (var i = 0; i < len; i++) {
                        if (cardInfo.card[i]._id === xss(userUpdates.number)) {
                                exist = true;
                                break;
                        }
                }

                if (exist == false) {
                        usersCardData.addCard(email, userUpdates).then(() => {
                                res.status(200).json({ success: true });
                        });
                } else {
                        res.status(400).json({ error: "This card is already saved" });
                }

        })
        .catch((error) => {     // rendering error page
                res.render('alerts/error', {
                        mainTitle: "Server Error •",
                        code: 500,
                        message: error,
                        url: req.originalUrl,
                        user: req.user
                });
        });
});

//------------------------ route to delete user information by id
router.delete('/', isLoggedIn, (req, res) => {

        let cardId = xss(req.body.cardNumber);
        let email = xss(req.user._id);

        usersCardData.deleteCard(email, cardId).then(() => {
                res.json({ success: true });
        })
        .catch((error) => {     // rendering error page
                res.render('alerts/error', {
                        mainTitle: "Server Error •",
                        code: 500,
                        message: error,
                        url: req.originalUrl,
                        user: req.user
                });
        });
});

// exporting routing apis
module.exports = router;