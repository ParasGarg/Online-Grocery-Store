/* importing required files and packages */
const express = require('express');
const usersRouter = express.Router();

/* users authentication */
usersRouter.use("/login", require('./auth/user-login'));		// url: ~/user/login	description: user login route
usersRouter.use("/logout", require('./auth/user-logout'));		// url: ~/user/logout	description: user logout route

/* users data access objects */
usersRouter.use("/info", require('./dao/get-user-info'));		// url: ~/user/info		description: get user info route
usersRouter.use("/new", require('./dao/create-new-user'));		// url: ~/user/new		description: add new user route
usersRouter.use("/update", require('./dao/update-user-info'));	// url: ~/user/update	description: update user info route

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