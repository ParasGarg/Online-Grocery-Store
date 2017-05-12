/* database collection configuration */
const dbConnection = require('./mongodb-connection');

/* This will allow to have one reference to each collection per app */
let getCollectionFn = (collection) => {
    let _col = undefined;

    return () => {
        if (!_col) {

            _col = dbConnection().then((db) => {
                return db.collection(collection);
            });
        }

        return _col;
    }
}

/* listing collections here: */
module.exports = {
    contacts: getCollectionFn("contacts"),
    credentials: getCollectionFn("credentials"),
    orders: getCollectionFn("orders"),
    products: getCollectionFn("products"),
    subscriptions: getCollectionFn("subscriptions"),
    transactions: getCollectionFn("transactions"),
    transactionWallet: getCollectionFn("walletTransaction"),    
    users: getCollectionFn("users")
};