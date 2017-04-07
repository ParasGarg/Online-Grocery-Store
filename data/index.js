const usersData = require('./users');

let dataMethod = (app) => {
    app.use("/user", usersData);
};

module.exports = {
    users: require("./users")
};