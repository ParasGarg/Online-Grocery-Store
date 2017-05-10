/* importing required files and packages */
const express = require('express');
const supportsRouter = express.Router();

/* supports services */
supportsRouter.use("/contact-us", require('./dao/contact-us'));			// url: ~/support/contact-us
supportsRouter.use("/subscription", require('./dao/subscribe-us'));		// url: ~/support/subscription

/* non existing page configuration */
supportsRouter.use("*", (req, res) => {
	res.render('alerts/error', {
		mainTitle: "Page Not Found •",
		code: 404,
		message: `Page Not Found`,
		url: req.originalUrl,
		user: req.user
	});
});

module.exports = supportsRouter;