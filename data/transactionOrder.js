/* Order Transaction Collection
 * Order Transaction Controllers *
 * Data Access Object *
 * Order Transaction Controllers for DAO actions *

 * Controllers Index: 
        ==============================================================================
        | S.No. |      Function Call     |                Description                |
        ==============================================================================
        |   1.  | getTransactionById     | Get a transaction by its id               |
        ------------------------------------------------------------------------------
        |   2.  | getTransactionByUserId | Get all transaction details for a user    |
        ------------------------------------------------------------------------------
        |   3.  | logTransaction         | Log trasaction details for order expense |
        ------------------------------------------------------------------------------
*/

/* importing required files and packages */
const uuid = require('uuid');
const mongoDbCollection = require('../config/mongodb-collection');
const orderTransaction = mongoDbCollection.transactionOrder;

/* exporting controllers apis */
module.exports = orderTransactionsControllers = {

    //------------------------ fetch a order transaction information by transaction id
    getTransactionById: (id) => {
        return orderTransaction().then((orderTransactionCollection) => {  // returning a found json document else returning null
            return orderTransactionCollection.findOne({ _id: id });
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'order transaction' collection.");
        });
    },

	//------------------------ fetch all order transaction information by user email
    getTransactionByUserId: (email) => {
        return orderTransaction().then((orderTransactionCollection) => {  // returning a found json document else returning null
            return orderTransactionCollection.find({ user: email }).toArray();
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'orders transaction' collection.");
        });
    },

    //------------------------ insert/create a new transaction record
    logTransaction: (email, amount, cardData, cartItems, mode) => {
        return orderTransaction().then((orderTransactionCollection) => {
            
            // new user object
            let newLog = {
                _id: uuid.v4(),
				user: email,
				amount: amount,				
				card: cardData,
                items: cartItems,
                payMode: mode,
                date: new Date().toUTCString()
            }

            // adding a record in to the collection
            return orderTransactionCollection.insertOne(newLog)
                .then((newLogInformation) => {
                    return newLogInformation.insertedId;
                });
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'order transaction' collection.");
        });
    }
};