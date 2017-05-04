/* Users Collection
 * UsersCard Controllers *
 * Data Access Object *
 * UsersCard Controllers for DAO actions *

 * Controllers Index: 
        =========================================================================
        | S.No. |   Function Call   |                Description                |
        =========================================================================
        |   1.  | getCardById       | Search infomation for an existing card    |
        -------------------------------------------------------------------------
        |   2.  | getAllCard        | Fetch all card infomation for a user      |
        -------------------------------------------------------------------------
        |   3.  | createNewCard     | Create new card record in the collection  |
        -------------------------------------------------------------------------
        |   4.  | deleteCard        | delete an existing card information       |
        -------------------------------------------------------------------------
*/

/* importing required files and packages */
const xss = require('xss');
const mongoDbCollection = require('../config/mongodb-collection');
const users = mongoDbCollection.users;

module.exports = cardControllers = {

    //------------------------ fetch a card information by id
    getCardById: (id) => {
        return users().then((usersCollection) => {  // returning a found json document else returning null
            return usersCollection.findOne({ "card._id":id });
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'users card' collection.");
        });
    },

    //------------------------ fetch a all card information for a user
    getAllCard: (email) => {
        return users().then((usersCollection) => {  // returning all found json document else returning null
            return usersCollection.findOne({ _id:email }, { _id:0, card:1 });
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'users card' collection.");
        });
    },

    //------------------------ add a card information
    addCard: (email, newCardData) => {
        users().then((usersCollection) => {
            usersCollection.findOne({ _id:email }).then(() => {

               // new card object
                let addCard = { };

                // storing details
                if (newCardData.number) {
                    addCard['_id'] = xss(newCardData.number);
                }

                if (newCardData.username) {
                    addCard['name'] = xss(newCardData.username);
                }

                if (newCardData.type) {
                    addCard['type'] = xss(newCardData.type);
                }

                if (newCardData.issuer) {
                    addCard['issuer'] = xss(newCardData.issuer);
                }

                if (newCardData.exp) {
                    addCard['expiry'] = xss(newCardData.exp);
                }

                if (newCardData.cvv) {
                    addCard['cvv'] = xss(newCardData.cvv);
                }

                // updating user collection
                usersCollection.update({ _id:email }, { $push: { card: addCard } });
            })
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'users card' collection.");
        });
    },

    //------------------------ delete a card information
    deleteCard: (email, cardId) => {
        return users().then((usersCollection) => {
            return usersCollection.update({ _id:email }, { $pull: { card: { _id:cardId } } }).then((deletedCardInfo) => {
                if (deletedCardInfo.deletedCount === 0) {
                    return "deleted";
                }
            })
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'users card' collection.");
        });
    }
};