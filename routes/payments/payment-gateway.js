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
const usersWalletData = data.usersWallet;
const walletTransaction = data.transactionWallet;
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

    if (cartItems.length < 0) {
        res.render('alerts/error', {
            mainTitle: "Bad Request •",
		    code: 400,
		    message: "No Items in cart",
            url: req.originalUrl,
			user: req.user
        });
    }

    orderTransactionData.logTransaction(email, amount, cardData, cartItems, "Saved Card").then((transId) => {
        usersCartData.emptyCart(email).then((usrNewInfo) => {
            req.user = usrInfo;
            req.user.cartLen = 0;

            res.render('payment/payment-confirmation', {
                mainTitle: "Payment Successful •",
                user: req.user,
                redirectURL: "/user/dashboard/cart",
                amount: amount,
                orderId: transId
            });
        });
    })
    .catch((error) => {
        res.render('alerts/error', {
            mainTitle: "Server Error •",
		    code: 500,
		    message: error,
            url: req.originalUrl,
			user: req.user
        });
    });
});

//------------------------ route to render to create order transction for new card
router.post('/new', isLoggedIn, (req, res) => {
    
    let card = xss(req.body.savedCard);
    let amount = xss(req.body.amount);
    let email = xss(req.user._id);
    let usrInfo = req.user;

    // validating new card
    let userUpdates = req.body;
    var isError = false;
    var errMsg = "";

    if (Object.keys(userUpdates).length === 0 || userUpdates == undefined) {    // check for empty json passed
        errMsg = "No card information provided";
        isError = true;
    } else if (!userUpdates.cardName) {
        errMsg = "No card name provided";
        isError = true;
    } else if (!userUpdates.cardNumber) {
        errMsg = "No card number provided";
        isError = true;
    } else if (!userUpdates.cardType) {
        errMsg = "No card type provided";
        isError = true;
    } else if (!userUpdates.expMonth || !userUpdates.expYear) {
        errMsg = "No card expiry provided";
        isError = true;
    } else if (!userUpdates.cardCVV) {
        errMsg = "No card cvv provided";
        isError = true;
    }

    if(isError) {
        res.render('alerts/error', {
            mainTitle: "Forbidden •",
		    code: 403,
		    message: "Invalid payment information",
            url: req.originalUrl,
			user: req.user
        });
    }

    let cardData = {}
    cardData["number"] = xss(userUpdates.cardNumber);
    cardData["name"] = xss(userUpdates.cardName);
    cardData["type"] = xss(userUpdates.cardType);
    cardData["expiry"] = xss(userUpdates.expMonth) + "/" + xss(userUpdates.expYear);
    cardData["cvv"] = xss(userUpdates.cardCVV);

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

    if (cartItems.length < 0) {
        res.render('alerts/error', {
            mainTitle: "Bad Request •",
		    code: 400,
		    message: "No Items in cart",
            url: req.originalUrl,
			user: req.user
        });
    }

    orderTransactionData.logTransaction(email, amount, cardData, cartItems, "New Card").then((transId) => {
        usersCartData.emptyCart(email).then((usrNewInfo) => {
            req.user = usrInfo;
            req.user.cartLen = 0;

            res.render('payment/payment-confirmation', {
                mainTitle: "Payment Successful •",
                user: req.user,
                redirectURL: "/user/dashboard/cart",
                amount: amount,
                orderId: transId
            });
        });
    })
    .catch((error) => {
        res.render('alerts/error', {
            mainTitle: "Server Error •",
		    code: 500,
		    message: error,
            url: req.originalUrl,
			user: req.user
        });
    });
});

//------------------------ route to render to create order transction for wallet
router.post('/wallet', isLoggedIn, (req, res) => {
    
    let amount = xss(req.body.amount);
    let email = xss(req.user._id);
    let usrInfo = req.user;
    let cardData = {}

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

    if (cartItems.length < 0) {
        res.render('alerts/error', {
            mainTitle: "Bad Request •",
		    code: 400,
		    message: "No Items in cart",
            url: req.originalUrl,
			user: req.user
        });
    }

    orderTransactionData.logTransaction(email, amount, cardData, cartItems, "Wallet").then((transId) => {
        usersCartData.emptyCart(email).then((usrNewInfo) => {
            req.user = usrInfo;
            req.user.cartLen = 0;

            // loggin wallet
            let status = "Debit";
	        let remark = "Purchase Order#" + transId;
            
            usersWalletData.deductCash(email, amount).then((walletInfo) => {
                walletTransaction.logTransaction(email, amount, cardData, status, remark).then(() => {

                    req.user.wallet = walletInfo.wallet;
                    res.render('payment/payment-confirmation', {
                        mainTitle: "Payment Successful •",
                        user: req.user,
                        redirectURL: "/user/dashboard/cart",
                        amount: amount,
                        orderId: transId
                    });

                });
            });
        });
    })
    .catch((error) => {
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