/* users collection controllers */

/* 
 * Users Controllers *
 * This controller file contains all backend operations on users collection
 * Controllers Index: 
        ====================================================================================
        | S.No. |   Function Call   |                      Description                     |
        ====================================================================================
        |   1.  | getUserById       | Search infomation for a user from the collection     |
        ------------------------------------------------------------------------------------
        |   2.  | getAllUsers       | Search information for all users from the collection |
        ------------------------------------------------------------------------------------
        |   3.  | deleteUser        | Delete the user from the collection                  |
        ------------------------------------------------------------------------------------
*/

// importing required files and packages
const mongoDbCollection = require('../config/mongodb-collection');
const users = mongoDbCollection.users;

// exporting controllers apis
module.exports = adminControllers = {

    //------------------------ fetch a user information by email id
    getUserById: (email) => {
        return users().then((usersCollection) => {
            // returning a found json document else returning null
            return usersCollection.findOne({ _id:email }, { _id:1, name:1, mobile:1, cart:1, paymentInfo:1, wallet:1 });
        })
        .catch(() => {
            // returning a reject promise
            return Promise.reject("Server issue with 'users' collection.");
        });
    },

    //------------------------ fetch all users information
    getAllUsers: () => {
        return users().then((usersCollection) => {
            // returning a found json document else returning null
            return usersCollection.find({ }, { _id:1, name:1, mobile:1, cart:1, paymentInfo:1, wallet:1 }).toArray();
        })
        .catch(() => {
            // returning a reject promise
            return Promise.reject("Server issue with 'users' collection.");
        });
    },

    // delete a user record of specific id from users collection
    deleteUser: (id) => {
        return users().then((usersCollection) => {
            return usersCollection.removeOne({ _id:id })
                .then((deletedUserInformation) => {
                    if (deletedUserInformation.deletedCount === 0) {
                        return Promise.reject(`No result having id ${id} from users collection`);
                    }
                });
        }, () => {
            return Promise.reject("Server issue with 'users' collection.");
        });
    }
};