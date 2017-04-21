//const adminRoutes = require('./admin/index');
const paymentsRoutes = require('./payments');
const productsRoutes = require('./products');
const usersRoutes = require('./users');

const mainRoutes = (app) => {

    /* home page routes */
    app.use("/$/", (req, res) => {
        res.render('index');
    });

    /* customized routes */
    app.use("/payment", paymentsRoutes);    // payments routes
    app.use("/product", productsRoutes);    // products routes
    app.use("/user", usersRoutes);          // user routes

    /* non existing page configuration */
    app.use("*", (req, res) => {
        res.render('alerts/error', {
            mainTitle: "Page Not Found •",
            code: 404,
            message: `Page Not Found`,
            url: req.originalUrl 
        });
    });
};

module.exports = mainRoutes;