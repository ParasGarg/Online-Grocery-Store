const adminRoutes = require('./admin');
const credentialsRoutes = require('./credentials');
const usersRoutes = require('./users');

const routesMethod = (app) => {

    app.use("/admin", adminRoutes);                     // admin routes
    app.use("/user", usersRoutes);                      // user routes
    app.use("/$/", (req, res) => {                      // home routes
        res.status(200).json({ Message: "Your are at the home page" });
    });

    app.use("*", (req, res) => {                        // no page routes
        res.render('errors/404', { urlRequest: req.originalUrl });
    });
};

module.exports = routesMethod;