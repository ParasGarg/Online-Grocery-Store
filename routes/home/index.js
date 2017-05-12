/* 
 * Home Routers * 
 * Home Data Access Object *
 * Home Items *

 * Functionalities Index: 
        ======================================================================================================
        | S.No. |  Type  |         URL         |   Function Call   | Controller |         Description        |
        ======================================================================================================
        |   1.  | Post   | /products/doa       | addNewProduct     | products   | Add new product record     |
        ------------------------------------------------------------------------------------------------------
*/
/* importing required files and packages */
const express = require('express');
const router = express.Router();
const data = require('../../data');
const productsData = data.products;

//------ user authentication validation
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.render('users/auth/user-login-account', {
            mainTitle: "User Login •",
            url: "/",
        });
    }
}

/* global scoped function */
//------------------------ route to update user information by id
router.get('/', (req, res) => {
	productsData.getAllProducts().then((productsList) => {
		res.render('index', {
            mainTitle: "Welcome to",
            user: req.user,
			products: productsList
        });
    })
    .catch((error) => {
    	res.send({ error: error });
    })
});

/* global scoped function */
//------------------------ route to update user information by id
router.post('/:id', isLoggedIn, (req, res) => {

    let prodId = xss(req.params.id);
    let email = xss(req.body.email);

    if (!prodId) {
        res.status(400).json({ error: "No product selected" });
    }

    productData.getProductById(prodId).then((prodInfo) => {

        if (prodInfo != null) {
            usersCartData.addItemInCart(email, prodInfo).then(() => {

console.log(4);
                            
                res.status(200).json({ success: true });
            });
        } else {

console.log(5);
                    
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
// exporting routing apis
module.exports = router;