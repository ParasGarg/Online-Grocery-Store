/* importing required files and packages */
const express = require('express');
const usersRouter = express.Router();

/* users configuration */
usersRouter.use("/info", require('./configuration/info'));			// url: ~/user/info		description: get user info route
usersRouter.use("/new", require('./configuration/new'));			// url: ~/user/new		description: add new user route
usersRouter.use("/update", require('./configuration/update'));		// url: ~/user/update	description: update user info route

/* users authentication */
usersRouter.use("/login", require('./authentication/login'));		// url: ~/user/login		description: user login route
usersRouter.use("/logout", require('./authentication/logout'));		// url: ~/user/logout	description: user logout route

/* non existing page configuration */
usersRouter.use("*", (req, res) => {
	res.render('alerts/error', {
		code: 404,
		message: `Page Not Found`,
		url: req.originalUrl 
	});
});

module.exports = usersRouter;