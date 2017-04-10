/* database collection configuration */
const dbConnection = require('./mongoDbConnection');

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
    credentials: getCollectionFn("credentials"),
    orders: getCollectionFn("orders"),
    products: getCollectionFn("products"),
    transactions: getCollectionFn("transactions"),
    users: getCollectionFn("users"),
    wishes: getCollectionFn("wishes")
};