const adminRoutes = require('./admin');
const usersRoutes = require('./users');

const routesMethod = (app) => {
    app.use("/admin", adminRoutes);     // admin routes
    app.use("/user", usersRoutes);      // user routes
    app.use("/$/", (req, res) => {      // home routes
        res.render('index');
// /        res.status(200).json({ Message: "Your are at the home page" });
    });

    app.use("*", (req, res) => {        // no page routes
        res.render('alerts/error', { 
            code: 404,
            message: `Page Not Found`,
            url: req.originalUrl 
        });
    });
};

module.exports = routesMethod;