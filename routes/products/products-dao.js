/* 
 * Products Routers * 
 * Products Data Access Object *
 * Product Items *

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
const xss = require('xss');
const data = require('../../data');
const productsData = data.products;

/* global scoped function */
//------------------------ route to update user information by id
router.post('/', (req, res) => {

        let productUpdates = req.body;

        if (Object.keys(productUpdates).length === 0 || productUpdates == undefined) {    // check for empty json passed
                res.render("users/gui/user-card", {
                        mainTitle: "Bad Request •",
                        code: 400,
                        message: `No data has been provided for update.`,
                        url: req.originalUrl,
                        user: req.user
                });

        } else if (!productUpdates.title) {
                res.status(400).json({ error: "No title provided" });
        } else if (!productUpdates.description) {
                res.status(400).json({ error: "No description provided" });
        } else if (!productUpdates.category) {
                res.status(400).json({ error: "No category provided" });
        } else if (!productUpdates.expDate) {
                res.status(400).json({ error: "No expiry date provided" });
        } else if (!productUpdates.mfdDate) {
                res.status(400).json({ error: "No manufactured date provided" });
        } else if (!productUpdates.size) {
                res.status(400).json({ error: "No size provided" });
        } else if (!productUpdates.price) {
                res.status(400).json({ error: "No price provided" });
        } else if (!productUpdates.stock) {
                res.status(400).json({ error: "No stock provided" });
        } else if (!productUpdates.images) {
                productUpdates["images"] = []
        } else if (!productUpdates.suggestion) {
                productUpdates["suggestion"] = []
        } else if (!productUpdates.allegations) {
                productUpdates["allegations"] = []
        }
        
        productsData.addNewProduct(productUpdates.title, productUpdates.description, productUpdates.category, productUpdates.expDate, 
                productUpdates.mfdDate, productUpdates.size, productUpdates.price, productUpdates.stock, productUpdates.images, 
                productUpdates.suggestion, productUpdates.allegations)
                .then(() => {
                        res.status(200).send({ success: true });
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