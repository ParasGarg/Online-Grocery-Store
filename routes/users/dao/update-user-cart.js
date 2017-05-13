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
//------------------------ route to update user information by id
router.post('/:id/:loc', isLoggedIn, (req, res) => {

        let prodId = xss(req.params.id);
        let redirectLoc = xss(req.params.loc);
        let email = xss(req.user._id);

        if (!prodId) {
                res.status(400).json({ error: "No product selected" });
        }

        productData.getProductById(prodId).then((prodInfo) => {

                if (prodInfo != null) {
                        usersCartData.addItemInCart(email, prodInfo).then((userInfo) => {
                                req.user.cartLen = userInfo.cartLen;
                                
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

//------------------------ route to delete user information by id
router.delete('/', isLoggedIn, (req, res) => {

        let prodId = xss(req.body.prodId);
        let email = xss(req.user._id);

        usersCartData.deleteItemFromCart(email, prodId).then(() => {
                res.json({success: true})
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