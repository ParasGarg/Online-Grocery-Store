/* 
 * Users Routers * 
 * Users Data Access Object *
 * User Card *

 * Functionalities Index: 
        ====================================================================================================
        | S.No. |  Type  |         URL         |   Function Call   | Controller |        Description       |
        ====================================================================================================
        |   1.  | Post   | /user/update/card   | createNewCard     | usersCard  | Insert new card record   |
        ----------------------------------------------------------------------------------------------------
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
                        url: req.originalUrl
                });
        }
}

/* global scoped function */
//------------------------ route to update user information by id
router.post('/', isLoggedIn, (req, res) => {

        let userUpdates = req.body;
        let email = xss(req.user._id);

        if (Object.keys(userUpdates).length === 0 || userUpdates == undefined) {    // check for empty json passed
                res.render("users/dashboard/user-account", {
                        mainTitle: "Bad Request •",
                        code: 400,
                        message: `No data has been provided for update.`,
                        url: req.originalUrl
                });

        } else if (!userUpdates.cardName) {
                res.status(400).json({ error: "No card holder's name provided" });
        } else if (!userUpdates.cardNumber) {
                res.status(400).json({ error: "No card number provided" });
        } else if (!userUpdates.cardType) {
                res.status(400).json({ error: "No card type provided" });
        } else if (!userUpdates.cardIssuer) {
                res.status(400).json({ error: "No card issuer provided" });
        } else if (!userUpdates.expiry) {
                res.status(400).json({ error: "No card expiry provided" });
        } else if (!userUpdates.cvv) {
                res.status(400).json({ error: "No card cvv provided" });
        }
        
        usersCardData.getCardById(xss(userUpdates.cardNumber)).then((cardInfo) => {
                
                if (cardInfo == null) {
                        usersCardData.addCard(email, userUpdates).then((newCardInfo) => {
                                res.json(newCardInfo);
                                return;
                        });
                } else {
                        res.status(400).json({ error: "This card is already registered" });
                }

        })
        .catch((error) => {     // rendering error page
                res.render('alerts/error', {
                        mainTitle: "Server Error •",
                        code: 500,
                        message: error,
                        url: req.originalUrl
                });
        });
});

// exporting routing apis
module.exports = router;