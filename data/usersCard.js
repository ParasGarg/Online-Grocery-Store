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
        |   2.  | getCardByIds      | Search infomation a card and user combine |
        -------------------------------------------------------------------------
        |   3.  | getAllCard        | Fetch all card infomation for a user      |
        -------------------------------------------------------------------------
        |   4.  | createNewCard     | Create new card record in the collection  |
        -------------------------------------------------------------------------
        |   5.  | deleteCard        | delete an existing card information       |
        -------------------------------------------------------------------------
*/

/* importing required files and packages */
const xss = require('xss');
const mongoDbCollection = require('../config/mongodb-collection');
const users = mongoDbCollection.users;

module.exports = cardControllers = {

    //------------------------ fetch a card information by card id/number
    getCardById: (id) => {
        return users().then((usersCollection) => {  // returning a found json document else returning null
            return usersCollection.findOne({ _id:email, "card._id":id }, { "card._id":1, "card.name":1, "card.type":1, /*"card.issuer":1,*/ "card.expiry":1, "card.cvv":1 });
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'users card' collection.");
        });
    },

    //------------------------ fetch a card information by user id and card id/number
    getCardByIds: (email, id) => {
        return users().then((usersCollection) => {  // returning a found json document else returning null
            return usersCollection.findOne({ _id:email, "card._id":id }, { _id:0, card:1 }).then((cardList) => {

                    cardList = cardList.card;

                    if (!cardList) { 
                        return Promise.reject("No card is saved");
                    }

                    // finding comment location in comment array
                    var loc = 0;
                    while (loc < cardList.length) {
                        if (cardList[loc]._id === id.toString()) {
                            break;
                        }

                        loc++;
                    }

                    // creating json variable
                    let cardDetails = {
                        _id: id,
                        name: cardList[loc].name,
                        type: cardList[loc].type,
                        //issuer: cardList[loc].issuer,
                        expiry: cardList[loc].expiry,
                        cvv: cardList[loc].cvv
                    };

                    return cardDetails;
            });
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

                /*if (newCardData.issuer) {
                    addCard['issuer'] = xss(newCardData.issuer);
                }*/

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