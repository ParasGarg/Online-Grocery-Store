const usersData = require('./users');
const credentialsData = require('./credentials');

let dataMethod = (app) => {
    app.use("/user", usersData);
};

module.exports = {
    credentials: require('./credentials'),
    users: require('./users')
};