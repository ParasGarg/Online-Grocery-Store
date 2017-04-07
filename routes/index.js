const adminRoutes = require("./admin");
const usersRoutes = require("./users");

const routesMethod = (app) => {
    app.use("/admin", adminRoutes);
    app.use("/user", usersRoutes);

    app.use("*", (req, res) => {
        res.status(404).json({ error: "Page not found" });
        
       // let routes = path.resolve(`static/about.html`);
        //res.sendFile(routes);
    });
};

module.exports = routesMethod;