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
const xss = require('xss');
const data = require('../../../data');
const contactsData = data.contacts;

/* routes */
//------------------------ route to render to show status of subscription to authorized user
router.get('/', (req, res) => {
	res.render('support/contact', {
		mainTitle: "Contact Us •",
	});
});

//------------------------ route to activate user subscription
router.post('/', (req, res) => {
    let senderInfo = req.body;

    // checking for existing record
    contactsData.addContact(xss(senderInfo.name), xss(senderInfo.email), xss(senderInfo.mobile), xss(senderInfo.description)).then(() => {
		res.json({success: true});
		//res.redirect('back');
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