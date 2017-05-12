/* Users Collection
 * UsersCard Controllers *
 * Data Access Object *
 * UsersCart Controllers for DAO actions *

 * Controllers Index: 
        =========================================================================
        | S.No. |   Function Call   |                Description                |
        =========================================================================
        |   1.  | getCartById       | Search infomation for an existing card    |
        -------------------------------------------------------------------------
        |   2.  | getCartByIds      | Search infomation a card and user combine |
        -------------------------------------------------------------------------
        |   3.  | getAllCart        | Fetch all card infomation for a user      |
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

module.exports = cartControllers = {

    //------------------------ fetch a all cart information for a user
    getAllCartItems: (email) => {
        return users().then((usersCollection) => {  // returning all found json document else returning null
            return usersCollection.findOne({ _id:email }, { _id:0, cart:1 });
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'users cart' collection.");
        });
    },

    //------------------------ add a cart information
    addItemInCart: (email, prodInfo) => {
        users().then((usersCollection) => {
            usersCollection.findOne({ _id:email }).then(() => {

                // new cart object
                let addItem = { 
                    _id: prodInfo._id,
                    title: prodInfo.title,
                    description: prodInfo.description,
                    size: prodInfo.size,
                    price: prodInfo.price,
                    stock: prodInfo.stock,
                    image: prodInfo.images[0]
                };
                
                // updating user collection
                return usersCollection.update({ _id:email }, { $push: { cart: addItem } });
            })
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'users cart' collection.");
        });
    },

    //------------------------ delete a cart information
    deleteItemFromCart: (email, itemId) => {
        return users().then((usersCollection) => {
            return usersCollection.update({ _id:email }, { $pull: { cart: { _id:itemId } } }).then((deletedCartInfo) => {
                if (deletedCartInfo.deletedCount === 0) {
                    return "deleted";
                }
            })
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'users cart' collection.");
        });
    }
};