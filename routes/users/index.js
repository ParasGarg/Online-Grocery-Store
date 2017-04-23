/* importing required files and packages */
const express = require('express');
const usersRouter = express.Router();

/* users authentication */
usersRouter.use("/login", require('./auth/user-login'));					// url: ~/user/login
usersRouter.use("/logout", require('./auth/user-logout'));					// url: ~/user/logout
//usersRouter.use("/forgot-password", require('./auth/user-forgot'));			// url: ~/user/forgot-password

/* users data access objects */
usersRouter.use("/info", require('./dao/get-user-info'));					// url: ~/user/info
usersRouter.use("/new", require('./dao/create-new-user'));					// url: ~/user/new
usersRouter.use("/update", require('./dao/update-user-info'));				// url: ~/user/update

/* users personal settings */
usersRouter.use("/dashboard", require('./gui/user-dashboard'));				// url: ~/user/dashboard
usersRouter.use("/dashboard/account", require('./gui/user-account'));		// url: ~/user/dashboard/account
usersRouter.use("/dashboard/payments", require('./gui/user-payment-info'));	// url: ~/user/dashboard/payment-details
usersRouter.use("/dashboard/wallet", require('./gui/user-wallet'));			// url: ~/user/dashboard/wallet

/* non existing page configuration */
usersRouter.use("*", (req, res) => {
	res.render('alerts/error', {
		mainTitle: "Page Not Found •",
		code: 404,
		message: `Page Not Found`,
		url: req.originalUrl 
	});
});

module.exports = usersRouter;