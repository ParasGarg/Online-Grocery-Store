/* importing required files and packages */
const express = require('express');
const productsRouter = express.Router();

/* products data access objects */
//productsRouter.use("/info", require('./dao/info'));			// url: ~/product/info		description: get product info route
//productsRouter.use("/new", require('./dao/new'));			// url: ~/product/new		description: add new product route
//productsRouter.use("/update", require('./dao/update'));		// url: ~/product/update	description: update product info route
//productsRouter.use("/delete", require('./dao/delete'));		// url: ~/product/delete	description: delete product route

/* */
productsRouter.use("/confirmation", require('./cont/payment-confirmation'));

/* non existing page configuration */
productsRouter.use("*", (req, res) => {
	res.render('alerts/error', {
		code: 404,
		message: `Page Not Found`,
		url: req.originalUrl 
	});
});

module.exports = productsRouter;