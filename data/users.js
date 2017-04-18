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
        |   3.  | createNewUser     | Create new user record in the collection             |
        ------------------------------------------------------------------------------------
        |   4.  | updateUser        | Update user information in the collection            |
        ------------------------------------------------------------------------------------
        |   5.  | deleteUser        | Delete the user from the collection                  |
        ------------------------------------------------------------------------------------
*/

// importing required files and packages
const mongoDbCollection = require('../config/mongoDbCollection');
const users = mongoDbCollection.users;

// exporting controllers apis
module.exports = usersControllers = {

    //------------------------ fetch a user information by email id
    getUserById: (email) => {
        return users().then((usersCollection) => {
            // returning a found json document else returning null
            return usersCollection.findOne({ _id:email }, { _id:1, name:1, mobile:1 });
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
            return usersCollection.find({ }, { _id:1, name:1, mobile:1 }).toArray();
        })
        .catch(() => {
            // returning a reject promise
            return Promise.reject("Server issue with 'users' collection.");
        });
    },


    //------------------------ insert/create a new user record
    createNewUser: (usrName, usrEmail, usrMobile, usrImage) => {
        return users().then((usersCollection) => {

            // new user object
            let newUser = {
                _id: usrEmail,
                name: usrName,
                mobile: usrMobile,
                image: usrImage,
                regDate: new Date("2010-06-09T15:20:00Z").toUTCString(),
                paymentMode: null,
                paymentInfo: null,
                promoCode: null,
                wallet: 0                
            }

            // adding a record in to the collection
            return usersCollection.insertOne(newUser)
                .then((newUserInformation) => {
                    return newUserInformation.insertedId;
                })
                .then((newUserId) => {
                    // returning created user document
                    return usersControllers.getUserById(newUserId);
                })
        })
        .catch(() => {
            // returning a reject promise
            return Promise.reject("Server issue with 'users' collection.");
        });        
    },

    //------------------------  update an existing user information
    updateUser: (userEmail, userUpdates) => {
        return users().then((usersCollection) => {
            
            // update user object (empty)
            let userChanges = { };

            // checking for values to update
            if(userUpdates.name) {
                userChanges['name'] = userUpdates.name;
            }

            if (userUpdates.mobile) {
                userChanges['mobile'] = userUpdates.mobile;
            }

            if (userUpdates.image) {
                userChanges['image'] = userUpdates.image;
            }

            if(userUpdates.paymentMode) {
                userChanges['paymentMode'] = userUpdates.paymentMode;
            }

            if (userUpdates.paymentInfo) {
                userChanges['paymentInfo'] = userUpdates.paymentInfo;
            }

            if (userUpdates.wallet) {
                userChanges['wallet'] = userUpdates.wallet;
            }

            // updating user information into the collection
            return usersCollection.updateOne( { _id:userEmail }, { $set:userChanges } ).then(() => { 
                return usersControllers.getUserById(userEmail); 
            });
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