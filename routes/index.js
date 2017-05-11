/* importing required files and packages */
const passport = require('../config/passport-users');
const paymentsRoutes = require('./payments');
const productsRoutes = require('./products/products-dao');
const supportsRoutes = require('./supports');
const usersRoutes = require('./users');

// check user authenticity
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        return next();
    }
}

const mainRoutes = (app) => {

    /* home page routes */
    app.use("/$/", (req, res) => {
        res.render('index', {
            mainTitle: "Welcome to",
            user: req.user
        });
    });

    /* customized routes */
    //app.use("/payment", paymentsRoutes);    // payments routes
    app.use("/product", productsRoutes);    // products routes
    app.use("/support", supportsRoutes);    // supports routes
    app.use("/user", usersRoutes);          // user routes

    /* non existing page configuration */
    app.use("*", (req, res) => {
        res.render('alerts/error', {
            mainTitle: "Page Not Found •",
            code: 404,
            message: `Page Not Found`,
            url: req.originalUrl,
            user: req.user
        });
    });
};

module.exports = mainRoutes;