const credentialsData = require('./credentials');
const subscriptionsData = require('./subscriptions');
const usersData = require('./users');

let dataMethod = (app) => {
    app.use("/credentials", credentialsData);
    app.use("/subscription", subscriptionsData);
    app.use("/user", usersData);
};

module.exports = {
    credentials: require('./credentials'),
    subscriptions: require('./subscriptions'),
    users: require('./users')
};