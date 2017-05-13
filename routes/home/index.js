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
// exporting routing apis
module.exports = router;