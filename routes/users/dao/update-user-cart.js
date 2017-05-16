/* 
 * Users Routers * 
 * Users Data Access Object *
 * User Cart *

 * Functionalities Index: 
        =======================================================================================================
        | S.No. |  Type  |         URL         |    Function Call   | Controller |         Description        |
        =======================================================================================================
        |   1.  | Post   | /user/update/cart   | addItemInCart      | usersCart  | Insert new cart record     |
        -------------------------------------------------------------------------------------------------------
        |   2.  | Delete | /user/update/cart   | deleteItemFromCart | usersCart  | Delete a saved cart record |
        -------------------------------------------------------------------------------------------------------
*/
/* importing required files and packages */
const express = require('express');
const router = express.Router();
const xss = require('xss');
const data = require('../../../data');
const usersData = data.users;
const usersCartData = data.usersCart;
const productData = data.products;
const passport = require('../../../config/passport-users');

/* local scoped function */
//------ user authentication validation
function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
                return next();
        } else {
                res.render('users/auth/user-login-account', {
                        mainTitle: "User Login •",
                        url: `/product/id/${xss(req.params.id)}`
                });
        }
}

/* global scoped function */
//------------------------ route to update user cart item
router.post('/:id/:loc', isLoggedIn, (req, res) => {

        let prodId = xss(req.params.id);
        let redirectLoc = xss(req.params.loc);
        let email = xss(req.user._id);

        if (!prodId) {
                res.status(400).json({ error: "No product selected" });
        }

        productData.getProductById(prodId).then((prodInfo) => {

                if (prodInfo != null) {
                        usersCartData.addItemInCart(email, prodInfo).then((cartLen) => {
                                req.user.cartLen = cartLen;

                                if (redirectLoc === "home") {
                                        res.redirect('/');
                                }

                                if (redirectLoc === "product-view") {
                                        res.render('product/product-added-cart', {
                                                mainTitle: "Item Added •",
                                                user: req.user
                                        });
                                }
                        });
                } else {
                        res.render('alerts/error', {
                                mainTitle: "Bad Request •",
                                code: 400,
                                message: "No such product exists",
                                url: req.originalUrl,
                                user: req.user
                        });
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

//------------------------ route to update cart quantity
router.put('/', isLoggedIn, (req, res) => {

        let email = xss(req.user._id);
        let prodId = xss(req.body.id);
        let quantity = parseInt(xss(req.body.qty));

        if (quantity < 1 && quantity > 5) {
                res.json({ success: false });
        }

        usersCartData.getProductById(email, prodId).then((isProduct) => {
                if (isProduct != null) {
                        usersCartData.updateItemQty(email, prodId, quantity).then((userInfo) => {

                                req.user = userInfo;
                                req.user.cartLen = userInfo.cartLen;
                                res.json({ success: true });
                                
                        });
                } else {
                        res.render('alerts/error', {
                                mainTitle: "Bad Request •",
                                code: 400,
                                message: "Invalid product id",
                                url: req.originalUrl,
                                user: req.user
                        });
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

//------------------------ route to delete user cart item
router.delete('/', isLoggedIn, (req, res) => {

        let prodId = xss(req.body.id);
        let email = xss(req.user._id);

        usersData.getUserById(email).then((userDetails) => {

                let isItemExists = false;
                if (userDetails != null) {
                    for(var i = 0; i < userDetails.cart.length; i++ ) {
                        if (userDetails.cart[i]._id === prodId) {

                                isItemExists = true;
                                usersCartData.deleteItemFromCart(email, prodId, userDetails.cart[i].qty).then((userInfo) => {

                                        req.user = userInfo;
                                        req.user.cartLen = userInfo.cartLen;
                                        res.json({ success: true, cartSize: userInfo.cartLen });
                                });
                            break;
                        }
                    }

                    if (isItemExists == false) {
                        res.render('alerts/error', {
                                mainTitle: "Bad Request •",
                                code: 400,
                                message: "Invalid product id",
                                url: req.originalUrl,
                                user: req.user
                        });
                    }

                } else {
                        res.render('alerts/error', {
                                mainTitle: "Bad Request •",
                                code: 400,
                                message: "Invalid user",
                                url: req.originalUrl,
                                user: req.user
                        }); 
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

// exporting routing apis
module.exports = router;