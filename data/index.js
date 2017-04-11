const credentialsData = require('./credentials');
const usersData = require('./users');

let dataMethod = (app) => {
    app.use("/credentials", credentialsData);
    app.use("/user", usersData);
};

module.exports = {
    credentials: require('./credentials'),
    users: require('./users')
};