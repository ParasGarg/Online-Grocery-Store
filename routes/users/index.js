/* users actions */
const getUser = require('./action/info');
const newUser = require('./action/new');
const updateUser = require('./action/update');

/* users access */
const loginUser = require('./access/login');
const logoutUser = require('./access/logout');

/* users route methods */
const usersRoutes = (app) => {
	app.use("/user/info", getUser);				// get user information
	app.use("/user/new", newUser);				// create new user
	app.use("/user/update", updateUser);		// update user

	app.use("/user/login", loginUser);			// user login
	app.use("/user/logout", logoutUser);		// user logout

	app.use("*", (req, res) => {                // no page routes
        res.render('alerts/error', { 
            code: 404,
            message: `Page Not Found`,
            url: req.originalUrl 
        });
    });
};

module.exports = usersRoutes;