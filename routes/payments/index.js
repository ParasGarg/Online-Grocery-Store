/* importing required files and packages */
const express = require('express');
const paymentsRouter = express.Router();

/* payment route */
paymentsRouter.use("/gateway", require('./payment-gateway'));				// url: ~/payment/gateway
paymentsRouter.use("/confirmation", require('./payment-confirmation'));		// url: ~/payment/confirmation
paymentsRouter.use("/checkout", require('../products/product-checkout'));	// url: ~/payment/checkout

/* non existing page configuration */
paymentsRouter.use("*", (req, res) => {
	res.render('alerts/error', {
		mainTitle: "Page Not Found •",
		code: 404,
		message: `Page Not Found`,
		url: req.originalUrl,
		user: req.user
	});
});

module.exports = paymentsRouter;