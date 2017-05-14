/* 
 * Payments Routers *
 * Gateway *
 * This route file contains apis for payment gateway operations
 * Functionalities Index: 
        =====================================================================================================================
        | S.No. |  Type  |        URL        |   Function Call   | Controller |                 Description                 |
        =====================================================================================================================
        |   1.  | Get    | /payment/gateway  | createNewUser     | ***        | Render a page for gateway form              |
        ---------------------------------------------------------------------------------------------------------------------
        |   2.  | Post   | /payment/gateway  | createNewUser     | payments   | Create new order and transction id for user |
        ---------------------------------------------------------------------------------------------------------------------
*/

/* importing required files and packages */
const express = require('express');
const router = express.Router();
const xss = require('xss');
const data = require('../../data');
const usersData = data.users;
const orderTransactionData = data.transactionOrder;
const usersCartData = data.usersCart;
const passport = require('../../config/passport-users');

// check user authenticity
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
       return next();
    } else {
        res.render('alerts/error', {
            mainTitle: "Page Not Found •",
		    code: 404,
		    message: "Page Not Found",
            url: req.originalUrl,
			user: req.user
        });
    }
}

//------------------------ route to render to create order transction for saved card
router.post('/saved', isLoggedIn, (req, res) => {
    
    let card = xss(req.body.savedCard);
    let amount = xss(req.body.amount);
    let email = xss(req.user._id);
    let usrInfo = req.user;

    // validating saved card
    let isCardValid = false;
    let cardData = {}
    for (var i = 0; i < usrInfo.card.length; i++) {
        if (card === usrInfo.card[i]._id) {
            cardData["number"] = usrInfo.card[i]._id;
            cardData["name"] = usrInfo.card[i].name;
            cardData["type"] = usrInfo.card[i].type;
            cardData["expiry"] = usrInfo.card[i].expiry;
            cardData["cvv"] = usrInfo.card[i].cvv;
            isCardValid = true;
            break;
        }
    }

    if (!isCardValid) {
        res.render('alerts/error', {
            mainTitle: "Bad Request •",
		    code: 400,
		    message: "Invalid Card",
            url: req.originalUrl,
			user: req.user
        });
    }

    // adding card items
    let cartItems = [];
    for (var i = 0; i < usrInfo.cart.length; i++) {

        let item = {
            _id: usrInfo.cart[i]._id,
            title: usrInfo.cart[i].title,
            qty: usrInfo.cart[i].qty,
            price: usrInfo.cart[i].price,
            total: usrInfo.cart[i].total
        }

        cartItems.push(item);
    }

    orderTransactionData.logTransaction(email, amount, cardData, cartItems).then((transId) => {
        usersCartData.emptyCart(email).then((usrNewInfo) => {
            req.user = usrInfo;

            res.render('payment/payment-confirmation', {
                mainTitle: "Payment Successful •",
                user: req.user,
                redirectURL: "/user/dashboard/cart",
                amount: amount,
                orderId: transId,
                cartLen: 0
            });
        });
    });
});

// exporting routing apis
module.exports = router;