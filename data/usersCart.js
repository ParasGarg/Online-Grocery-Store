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

    //------------------------ fetch a product information for a user by product id
    getProductById: (email, prod) => {
        return users().then((usersCollection) => {
            return usersCollection.findOne({ _id:email, "cart._id":prod });
        });
    },

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
        return users().then((usersCollection) => {
            return usersCollection.findOne({ _id:email }).then((userInfo) => {

                // cart length object
                let userChanges = {
                    cartLen: userInfo.cartLen
                }

                let exist = false;
                let quant = 1;
                for(var i = 0; i < userInfo.cart.length; i++ ) {
                    if (userInfo.cart[i]._id === prodInfo._id) {
                        exist = true;
                        quant = quant + userInfo.cart[i].qty;
                        break;
                    }
                }

                if(!exist) {
                    // new cart object
                    let addItem = { 
                        _id: prodInfo._id,
                        title: prodInfo.title,
                        description: prodInfo.description,
                        size: prodInfo.size,
                        price: prodInfo.price,
                        image: prodInfo.images[0],
                        qty: quant,
                        total: prodInfo.price * quant
                    };

                    userChanges["cartLen"] = userChanges.cartLen + 1;

                    // updating user collection
                    usersCollection.update({ _id:email }, { $push: { cart: addItem } });
                    usersCollection.updateOne({ _id: email }, { $set: userChanges })
                } else {
                    usersCollection.update({ "cart._id":prodInfo._id }, { $set: { cartLen: userChanges.cartLen + 1, "cart.$.qty": quant, "cart.$.total": Math.round(prodInfo.price * quant * 100)/100 } });
                    userChanges["cartLen"] = userChanges.cartLen + 1;
                }

                return userChanges.cartLen;                
            });
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'users cart' collection.");
        });
    },

    //------------------------ update a cart quantity information
    updateItemQty: (email, itemId, itemQty) => {
        return users().then((usersCollection) => {
            return usersCollection.findOne({ _id:email }).then((userInfo) => {

                if (userInfo != null) {

                    let cartLen = userInfo.cartLen;
                    let itemCost = 0;

                    for(var i = 0; i < userInfo.cart.length; i++ ) {
                        if (userInfo.cart[i]._id === itemId) {
                            itemCost = userInfo.cart[i].price;
                            cartLen = cartLen - userInfo.cart[i].qty + itemQty;
                            break;
                        }
                    }

                    usersCollection.update({ _id:email, "cart._id":itemId }, { $set: { cartLen: cartLen, "cart.$.qty": itemQty, "cart.$.total": Math.round(itemCost * itemQty * 100)/100 } });
                    return usersCollection.findOne({ _id:email });
                }
                
                res.json({error: "user not exist"});
            });
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'users cart' collection.");
        });
    },

    //------------------------ delete a cart information
    deleteItemFromCart: (email, itemId, itemQtyToDelete) => {
        return users().then((usersCollection) => {
            return usersCollection.update({ _id:email }, { $pull: { cart: { _id:itemId } } }).then((deletedCartInfo) => {
               
                if (deletedCartInfo.deletedCount === 0) {
                    return "not deleted";
                } else {
                    return usersCollection.findOne({ _id:email }).then((userInfo) => {

                        // decrease cart length
                        let userChanges = {
                            cartLen: userInfo.cartLen - itemQtyToDelete
                        }

                        // updating user collection
                        usersCollection.updateOne({ _id: email }, { $set: userChanges });
                        return usersCollection.findOne({ _id:email });
                    });
                }
            });
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'users cart' collection.");
        });
    },

    emptyCart: (email) => {
        return users().then((usersCollection) => {
            return usersCollection.findOne({ _id:email }).then((userInfo) => {

                if (userInfo != null) {

                    usersCollection.update({ _id:email }, { $set: { cart: [], cartLen: 0 } });
                    return usersCollection.findOne({ _id:email });
                }
                
                res.json({error: "user not exist"});
            });
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'users cart' collection.");
        });
    }
};