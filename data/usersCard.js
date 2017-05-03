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

module.exports = cardController = {

    //------------------------ fetch a card information by id
    getCardById: (id) => {
        return users().then((usersCollection) => {  // returning a found json document else returning null
            return usersCollection.findOne({ "card._id":id });
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'users' collection.");
        });
    },

    //------------------------ fetch a all card information for a user
    getAllCard: (email) => {
        return users().then((usersCollection) => {  // returning all found json document else returning null
            return usersCollection.find({ _id:email }, { _id:0, card:1 }).toArray();
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'users' collection.");
        });
    },

    //------------------------ add a card information
    addCard: (email, newCardData) => {
        return users().then((usersCollection) => {
            return usersCollection.findOne({ _id:email }).then(() => {

               // new card object
                let addCard = { };

                // storing details
                if (newCardData.number) {
                    addCard['_id'] = xss(newCardData.number);
                }

                if (newCardData.user) {
                    addCard['name'] = xss(newCardData.user);
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
                return usersCollection.update({ _id:email }, { $push: { card: addCard } }).then(() => {
                    return addCard;
                });
            })
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'users' collection.");
        });
    },

    //------------------------ delete a card information
    deleteCard: (cardId) => {
        return users().then((usersCollection) => {
            return usersCollection.update({ "card._id":cardId }, { $pull: { card: { _id:cardId } } }).then((deletedCardInfo) => {
                if (deletedCardInfo.deletedCount === 0) {
                    return res.status(500).json({ error: `No card having ${id} could not be deleted` });
                }
            })
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'users' collection.");
        });
    }
};