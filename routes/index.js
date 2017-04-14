const adminRoutes = require('./admin');
//const usersRoutes = require('./users');

const routesMethod = (app) => {
    
    app.use("/$/", (req, res) => {      // home routes
        res.render('index');
    });

    app.use("/admin", adminRoutes);     // admin routes
//    app.use("/user", usersRoutes);      // user routes

    /* sub routes configuration */
    const configUserRoutes = require("./users");
    configUserRoutes(app);

    app.use("*", (req, res) => {        // no page routes
        res.render('alerts/error', { 
            code: 404,
            message: `Page Not Found`,
            url: req.originalUrl 
        });
    });
};

module.exports = routesMethod;