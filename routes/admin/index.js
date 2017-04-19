/* importing required files and packages */
const express = require('express');
const adminRouter = express.Router();

/* admin configuration */
//const getAdmin = require('./configuration/info');
//const newAdmin = require('./configuration/new');
//const updateAdmin = require('./configuration/update');

/* admin authentication */
//const loginAdmin = require('./authentication/login');
//const logoutAdmin = require('./authentication/logout');

/* admin products */
//const getProduct = require('./products/info');
//const addProduct = require('./products/add');
//const updateProduct = require('./products/update');
//const deleteProduct = require('./products/delete');

/* admin users */
adminRouter.use("/user/info", require('./users/info'));				// url: ~/admin/user/info		description: get user info route
//adminRouter.use("/user/delete", require('./users/delete'));			// url: ~/admin/user/delete		description: delete user info route

/* admin route methods */
//const adminRoutes = (app) => {

	// configuration routes
//	app.use("/admin/info", getAdmin);						// get admin information
//	app.use("/admin/new", newAdmin);						// create new admin
//	app.use("/admin/update", updateAdmin);					// update admin

	// authentication routes
//	app.use("/admin/login", loginAdmin);					// admin login
//	app.use("/admin/logout", logoutAdmin);					// admin logout

/* non existing page configuration */
adminRouter.use("*", (req, res) => {
	res.render('alerts/error', {
		code: 404,
		message: `Page Not Found`,
		url: req.originalUrl
	});
});

module.exports = adminRouter;