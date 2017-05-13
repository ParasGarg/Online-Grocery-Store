/* 
 * Subscription Routers * Subscribe Us *
 * Data Access Object *
 * Subscription Routes for DAO actions
 * Functionalities Index:
 
 *      Controller "subscription" 
        =================================================================================================================================
        | S.No. |  Type  |             URL/ROUTES             |             Function Call            |               Action             |
        =================================================================================================================================
        |   1.  | Get    | /support/subscription/status       | getSubscriptionById                  | check/fetch existing information |
        ---------------------------------------------------------------------------------------------------------------------------------
        |   2.  | Get    | /support/subscription/status/:id   | getSubscriptionById                  | check for anonymous user info    |
        ---------------------------------------------------------------------------------------------------------------------------------
        |   3.  | Post   | /support/subscription/subscribe    | addSubscription & updateSubscription | create/update operations         |
        ---------------------------------------------------------------------------------------------------------------------------------
        |   4.  | Put    | /support/subscription/unsubscribe  | removeSubscription                   | deactive/updae operations        |
        ---------------------------------------------------------------------------------------------------------------------------------
*/

/* importing required files and packages */
const express = require('express');
const router = express.Router();
const xss = require('xss');
const data = require('../../../data');
const subscriptionsData = data.subscriptions;

/* local scoped functions */
//------------------------ check user authenticity
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
        return next();        
    } else {
        res.render('alerts/error', {
            mainTitle: "Unauthorized Access •",
		    code: 401,
            user: req.user,
		    message: "You are not allowed to access this page.",
            url: req.originalUrl,
            user: req.user
        });
    }
}

/* routes */
//------------------------ route to render to show status of subscription to authorized user
router.get('/status', isLoggedIn, (req, res) => {

    // searching for a record
    subscriptionsData.getSubscriptionById(req.user._id).then((subscriptionDetails) => {
        // checking for a value in the received document
        if (subscriptionDetails != null) {

            res.render('support/subscription', {
                mainTitle: "Subscription Status •",
                user: req.user,
                status: subscriptionDetails.activeStatus
            });
        
        } else {

            res.render('support/subscription', {
                mainTitle: "Subscription Status •",
                user: req.user,
                status: false
            });

        }
    })
});

//------------------------ route to render to show status of subscription to anonymous user
router.get('/status/:email', (req, res) => {
    if (req.isAuthenticated() && xss(req.params.email) == xss(req.user._id)) {
        res.redirect("/support/subscription/status");
    } else {
        // searching for a record
        subscriptionsData.getSubscriptionById(xss(req.params.email)).then((subscriptionDetails) => {
            // checking for a value in the received document
            if (subscriptionDetails != null) {

                res.render('support/subscription', {
                    mainTitle: "Subscription Status •",
                    anonymous: true,
                });
            
            } else {

                res.render('support/subscription', {
                    mainTitle: "Subscription Status •",
                    anonymous: false,
                });

            }
        })
    }
});

//------------------------ route to activate user subscription
router.post('/subscribe', (req, res) => {
    let email = null;
    
    if (req.body.email != undefined) {
        email = xss(req.body.email);
    } else if (req.user != undefined) {
        email = xss(req.user._id);      
    }

    // checking for existing record
    subscriptionsData.getSubscriptionById(email).then((subscriptionDocument) => {

        // validating received information
        // if user does not exists then value we get will be null
        if (subscriptionDocument == null) {

            // adding a record in a collection
            subscriptionsData.addSubscription(email).then(() => {
                 if (req.body.email != undefined) {
                   res.json({ email:email });
                } else if (req.user != undefined) {
                    res.redirect(`/support/subscription/status/${email}`);    
                }
            });

        } else {

            // updating a record in a collection
            subscriptionsData.updateSubscription(email).then(() => {
                if (req.body.email != undefined) {
                   res.json({ email:email });
                } else if (req.user != undefined) {
                    res.redirect(`/support/subscription/status/${email}`);    
                }
            });

        }
    })
    .catch((collectionError) => {
        // rendering error page
        res.render('alerts/error', {
            mainTitle: "Server Error •",
            code: 500,
            message: collectionError,
            url: req.originalUrl,
            d
        });
    });
});

//------------------------ route to deactivate user subscription
router.post('/unsubscribe', (req, res) => {
    let email = xss(req.user._id);

    // updating a record
    subscriptionsData.removeSubscription(email).then(() => {
        res.redirect("/support/subscription/status");  
    })
    .catch((collectionError) => {
        // rendering error page
        res.render('alerts/error', {
            mainTitle: "Server Error •",
            code: 500,
            message: collectionError,
            url: req.originalUrl,
            user: req.user
        });
    });
});

// exporting routing apis
module.exports = router;