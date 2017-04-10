/* credentials collection controllers */

/* 
 * Credentials Controllers *
 * This controller file contains all backend operations on credentials collection
 * Controllers Index: 
        ========================================================================================
        | S.No. |    Function Call    |                       Description                      |
        ========================================================================================
        |   1.  | getCredentialById   | Search a credential details from the collection        |
        ----------------------------------------------------------------------------------------
        |   3.  | createNewCredential | Create new credential record in the collection         |
        ----------------------------------------------------------------------------------------
        |   4.  | updateCredential    | Update credential information in the collection        |
        ----------------------------------------------------------------------------------------
        |   5.  | compareCredential   | Compares and matches email and password for validation |
        ----------------------------------------------------------------------------------------
		|   5.  | deleteCredential    | Delete the credential from the collection              |
        ----------------------------------------------------------------------------------------
        
*/

// importing required files and packages
const bcrypt = require('bcrypt');
const mongoDbCollection = require('../config/mongodbCollection');
const credentials = mongoDbCollection.credentials;

// function to hash normal user's password
function generateHashedPassword(password) {
	return bcrypt.hashSync(password, 10);
}

// exporting controllers apis
module.exports = credentialsControllers = {

    // fetching a credential information by it's id from credentials collection
    getCredentialById: (id) => {
        return credentials().then((credentialsCollection) => {
            // return a found json document else null 
            return credentialsCollection.findOne({ _id:id }, { _id:1, password:1 });
        }).catch(() => {
            return Promise.reject("Credentials collection response error.");
        });
    },

    // inserting a new credential record into credentials collection
    createNewCredential: (email, password) => {
        return credentials().then((credentialsCollection) => {

            // new credential object
            let newCredential = {
                _id: email,
				password: generateHashedPassword(password)
            }

            return credentialsCollection.insertOne(newCredential)
                .then((newCredentialInformation) => {
                    return newCredentialInformation.insertedId;
                })
                .then((newCredentialId) => {
                    return credentialsCollection.getCredentialById(newCredentialId);
                });
        });
    },

    // updating a credential information in the credentials collection
    updateCredential: (email, password) => {
        return credentials().then((credentialsCollection) => {
            
            // update credential object (empty)
            let credentialChanges = { };

            // checking for values to update
            if(password) {
                credentialChanges['password'] = generateHashedPassword(password);
            }

            return credentialsCollection.updateOne( { _id:email }, { $set:credentialChanges } )
                .then(() => {
                    return credentialsControllers.getCredentialById(email);
                });
        }).catch(() => {
            return Promise.reject("Credentials collection response error.");
        });
    },

	// compare the given credentials
	compareCredential: (id, password) => {
		return credentials().then((credentialsCollection) => {
			return credentialsCollection.findOne({ _id:id }, { _id:1, password:1 })
				.then((credentialInfo) => {
					// validating passwords
					if (bcrypt.compareSync(password, credentialInfo.password))
						return Promise.resolve("Password matched");        
					return Promise.reject("Incorrect Password");
				});
		}).catch(() => {
            return Promise.reject("Credentials collection response error.");
        });
	},

    // delete a credential record of specific id from credentials collection
    deleteCredential: (id) => {
        return credentials().then((credentialsCollection) => {
            return credentialsCollection.removeOne({ _id:id })
                .then((deletedCredentialInformation) => {
                    if (deletedCredentialInformation.deletedCount === 0) {
                        return Promise.reject(`No result having id ${id} from credentials collection`);
                    }
                });
        }).catch(() => {
            return Promise.reject("Credentials collection response error.");
        });
    }
};