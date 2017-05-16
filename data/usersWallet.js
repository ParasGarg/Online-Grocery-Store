/* Users Collection
 * UsersWallet Controllers *
 * Data Access Object *
 * UsersWallet Controllers for DAO actions *

 * Controllers Index: 
        =========================================================================
        | S.No. |   Function Call   |                Description                |
        =========================================================================
        |   1.  | getCashById       | Search infomation for an existing card    |
        -------------------------------------------------------------------------
        |   2.  | addCash           | Add cash in the collection                |
        -------------------------------------------------------------------------
        |   3.  | deductCash        | Deduct cash in the collection             |
        -------------------------------------------------------------------------
        |   4.  | logTransaction    | Log trasaction details for wallet expense |
        -------------------------------------------------------------------------
*/

/* importing required files and packages */
const xss = require('xss');
const mongoDbCollection = require('../config/mongodb-collection');
const users = mongoDbCollection.users;

module.exports = walletControllers = {

    //------------------------ fetch cash information by user id
    getCashById: (email) => {
        return users().then((usersCollection) => {  // returning a found json document else returning null
            return usersCollection.findOne({ _id:email }, { _id:0, wallet:1 });
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'users wallet' collection.");
        });
    },

    //------------------------ add cash into wallet
    addCash: (email, newCash) => {
        return users().then((usersCollection) => {
            return walletControllers.getCashById(email).then((walletInfo) => {

                let userChanges = {};
                let availableCash = walletInfo.wallet;
                let totalWalletCash = 0;

                // checking for values to update
                if (newCash) {
                    totalWalletCash = Math.round(newCash * 100 + availableCash * 100)/100;
                }

                if (totalWalletCash < 10000) {
                    // updating user information into the collection
                    userChanges['wallet'] = totalWalletCash;
                    return usersCollection.updateOne({ _id: email }, { $set: userChanges }).then(() => {
                        return walletControllers.getCashById(email);
                    });
                } else {
                    return false;
                }
            });
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'users wallet' collection.");
        });
    },

    //------------------------ deduct cash into wallet
    deductCash: (email, spendCash) => {
        return users().then((usersCollection) => {
            return walletControllers.getCashById(email).then((walletInfo) => {

                let userChanges = {};
                let availableCash = walletInfo.wallet;

                // checking for values to update
                if (spendCash) {
                    userChanges['wallet'] = Math.round(availableCash * 100 - spendCash * 100)/100;
                }

                // updating user information into the collection
                return usersCollection.updateOne({ _id: email }, { $set: userChanges }).then(() => {
                    return walletControllers.getCashById(email);
                });
            })
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'users wallet' collection.");
        });
    }
};