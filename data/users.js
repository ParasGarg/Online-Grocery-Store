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

//------ create alias of name
function makeAlias(name) {

    let alias = "";
    for (var i = 0; i < name.length; i++) {
        if((name.charCodeAt(i) >= 65 && name.charCodeAt(i) <= 90) || (name.charCodeAt(i) >= 97 && name.charCodeAt(i) <= 122)) {
            alias += name.charAt(i);
        } else if (name.charCodeAt(i) == 32 || name.charCodeAt(i) == 46 || name.charAt(i) == 44) {
            break;
        }
    }

/*    if (alias.length > 15) {
        
        var initial = name.charAt(0);
        if (name.charCodeAt(0) >= 97 && name.charCodeAt(0) <= 122) {
            initial = String.fromCharCode(name.charCodeAt(0) - 32);
        }

        alias = "Mr. " + initial;
    }
*/
    return alias;
}

/* exporting controllers apis */
module.exports = usersControllers = {

    //------------------------ fetch a user information by email id
    getUserById: (email) => {
        return users().then((usersCollection) => {  // returning a found json document else returning null
            return usersCollection.findOne({ _id: email }, { _id: 1, name: 1, alias:1, mobile: 1, cart: 1, cartLen:1, card: 1, wallet: 1 });
        })
        .catch(() => {  // returning a reject promise
            return Promise.reject("Server issue with 'users' collection.");
        });
    },

    //------------------------ insert/create a new user record
    createNewUser: (name, email, mobile) => {
        return users().then((usersCollection) => {
            
            var alias = makeAlias(name);

            // new user object
            let newUser = {
                _id: email,
                name: name,
                alias: alias,
                mobile: mobile,
                regDate: new Date().toUTCString(),
                cart: [],
                cartLen: 0,
                card: [],
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
                userChanges['alias'] = makeAlias(name);
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