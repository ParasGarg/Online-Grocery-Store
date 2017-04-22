/* 
 * Contacts Routers * Contact Us *
 * Data Access Object *
 * Contacts Routes for DAO actions
 * Functionalities Index:
 
 *      Controller "contacts" 
        =================================================================================================================================
        | S.No. |  Type  | 	      URL/ROUTES        |             Function Call            |               Action             |
        =================================================================================================================================
        |   1.  | Post   | /support/contact-us/     | addSubscription  | create/update operations         |
        ---------------------------------------------------------------------------------------------------------------------------------
*/

/* importing required files and packages */
const express = require('express');
const router = express.Router();
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
            url: req.originalUrl
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
    if (req.isAuthenticated() && req.params.email == req.user._id) {
        res.redirect("/support/subscription/status");
    } else {
        // searching for a record
        subscriptionsData.getSubscriptionById(req.params.email).then((subscriptionDetails) => {
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
        email = req.body.email;
    } else if (req.user != undefined) {
        email = req.user._id;      
    }

    // checking for existing record
    subscriptionsData.getSubscriptionById(email).then((subscriptionDocument) => {

        // validating received information
        // if user does not exists then value we get will be null
        if (subscriptionDocument == null) {

            // adding a record in a collection
            subscriptionsData.addSubscription(email).then(() => {
                res.redirect(`/support/subscription/status/${email}`);
            });

        } else {

            // updating a record in a collection
            subscriptionsData.updateSubscription(email).then(() => {
                res.redirect(`/support/subscription/status/${email}`);
            });

        }
    })
    .catch((collectionError) => {
        // rendering error page
        res.render('alerts/error', {
            mainTitle: "Server Error •",
            code: 500,
            message: collectionError,
            url: req.originalUrl
        });
    });
});

//------------------------ route to deactivate user subscription
router.post('/unsubscribe', (req, res) => {
    let email = req.user._id;

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
            url: req.originalUrl
        });
    });
});

// exporting routing apis
module.exports = router;