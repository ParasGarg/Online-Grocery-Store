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
        |   4.  | updateUserProfile | Update user profile information in the collection    |
        ------------------------------------------------------------------------------------
        |   5.  | deleteUser        | Delete the user from the collection                  |
        ------------------------------------------------------------------------------------
        
*/

// importing required files and packages
const mongoDbCollection = require('../config/mongoDbCollection');
const users = mongoDbCollection.users;

// exporting controllers apis
module.exports = usersControllers = {

    // fetching a user information by it's id from users collection
    getUserById: (id) => {
        return users().then((usersCollection) => {
            // return a found json document else null 
            return usersCollection.findOne({ _id:id }, { _id:1, name:1, mobile:1 });
        }, () => {
            return Promise.reject("Server issue with 'users' collection.");
        });
    },

    // fetching all users information from users collection
    getAllUsers: () => {
        return users().then((usersCollection) => {
            // return all found json documents else null
            return usersCollection.find({}, { _id:1, name:1, mobile:1 }).toArray();
        }, () => {
            return Promise.reject("Server issue with 'users' collection.");
        });
    },

    // inserting a new user record into users collection
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

            return usersCollection.insertOne(newUser)
                .then((newUserInformation) => {
                    return newUserInformation.insertedId;
                })
                .then((newUserId) => {
                    return usersControllers.getUserById(newUserId);
                })
        }, () => {
            return Promise.reject("Server issue with 'users' collection.");            
        });
    },

    // updating a user information in the users collection
    updateUserProfile: (userEmail, userUpdates) => {
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

            return usersCollection.updateOne( { _id:userEmail }, { $set:userChanges } )
                .then(() => {
                    return usersControllers.getUserById(userEmail);
                });
        }, () => {
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