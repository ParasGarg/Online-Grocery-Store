const contactsData = require('./contacts');
const credentialsData = require('./credentials');
const productsData = require('./products');
const subscriptionsData = require('./subscriptions');
const transactionWallet = require('./transactionWallet');
const usersData = require('./users');
const usersCardData = require('./usersCard');
const usersWalletData = require('./usersWallet');

let dataMethod = (app) => {
    app.use("/contacts-us", contactsData);
    app.use("/credentials", credentialsData);
    app.use("/products", productsData);
    app.use("/subscription", subscriptionsData);
    app.use("/user", usersData);
};

module.exports = {
    contacts: require('./contacts'),
    credentials: require('./credentials'),
    products: require('./products'),
    subscriptions: require('./subscriptions'),
    transactionWallet: require('./transactionWallet'),
    users: require('./users'),
    usersCard: require('./usersCard'),
    usersWallet: require('./usersWallet')
};