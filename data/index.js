const contactsData = require('./contacts');
const credentialsData = require('./credentials');
const subscriptionsData = require('./subscriptions');
const usersData = require('./users');
const usersCardData = require('./usersCard');

let dataMethod = (app) => {
    app.use("/contacts-us", contactsData);
    app.use("/credentials", credentialsData);
    app.use("/subscription", subscriptionsData);
    app.use("/user", usersData);
};

module.exports = {
    contacts: require('./contacts'),
    credentials: require('./credentials'),
    subscriptions: require('./subscriptions'),
    users: require('./users'),
    usersCard: require('./usersCard')
};