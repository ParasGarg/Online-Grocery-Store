/* Users Collection
 * Users Controllers *
 * Data Access Object *
 * Users Controllers for DAO actions *

 * Controllers Index: 
        =========================================================================
        | S.No. |   Function Call   |                Description                |
        =========================================================================
        |   1.  | getUserById       | Search infomation for an existing user    |
        -------------------------------------------------------------------------
        |   2.  | createNewUser     | Create new user record in the collection  |
        -------------------------------------------------------------------------
        |   3.  | updateProfile     | Update an existing user information       |
        -------------------------------------------------------------------------
        |   4.  | updateWallet      | Update existing user wallet amount        |
        -------------------------------------------------------------------------
*/

/* importing required files and packages */
const mongoDbCollection = require('../config/mongodb-collection');
const users = mongoDbCollection.users;

/* exporting controllers apis */
module.exports = usersControllers = {

    //------------------------ fetch a user information by email id
    getUserById: (email) => {
        return users().then((usersCollection) => {  // returning a found json document else returning null
            return usersCollection.findOne({ _id: email }, { _id: 1, name: 1, mobile: 1, cart: 1, card: 1, wish:1, wallet: 1 });
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'users' collection.");
        });
    },

    //------------------------ insert/create a new user record
    createNewUser: (name, email, mobile) => {
        return users().then((usersCollection) => {
            
            // new user object
            let newUser = {
                _id: email,
                name: name,
                mobile: mobile,
                regDate: new Date("2010-06-09T15:20:00Z").toUTCString(),
                cart: [],
                card: [],
                wish: [],
                wallet: 0
            }

            // adding a record in to the collection
            return usersCollection.insertOne(newUser)
                .then((newUserInformation) => {
                    return newUserInformation.insertedId;
                })
                .then((newUserId) => {  // returning created user document
                    return usersControllers.getUserById(newUserId);
                })
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'users' collection.");
        });
    },

    //------------------------  update an existing user profile information
    updateProfile: (email, name, mobile) => {
        return users().then((usersCollection) => {

            let userChanges = {};

            // checking for values to update
            if (name) {
                userChanges['name'] = name;
            }

            if (mobile) {
                userChanges['mobile'] = mobile;
            }

            // updating user information into the collection
            return usersCollection.updateOne({ _id: email }, { $set: userChanges }).then(() => {
                return usersControllers.getUserById(email);
            });
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'users' collection.");
        });
    },

    //------------------------  update an existing user wallet information
    updateWallet: (email, newCash, availableCash) => {
        return users().then((usersCollection) => {

            let userChanges = {};

            // checking for values to update
            if (newCash) {
                userChanges['wallet'] = newCash + availableCash;
            }

            // updating user information into the collection
            return usersCollection.updateOne({ _id: email }, { $set: userChanges }).then(() => {
                return usersControllers.getUserById(email);
            });
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'users' collection.");
        });
    },

    //------------------------ delete a user record of specific id from users collection
    deleteUser: (email) => {
        return users().then((usersCollection) => {
            return usersCollection.removeOne({ _id: email })
                .then((deletedUserInformation) => {
                    if (deletedUserInformation.deletedCount === 0) {
                        return Promise.reject(`No result having id ${email} from users collection`);
                    }
                });
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'users' collection.");
        });
    }
};