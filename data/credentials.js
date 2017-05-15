/* Credentials Collection
 * Credentials Controllers *
 * Data Access Object *
 * Credentials Controllers for DAO actions *

 * Controllers Index: 
        ========================================================================================
        | S.No. |    Function Call    |                       Description                      |
        ========================================================================================
        |   1.  | getCredentialById   | Search a credential details from the collection        |
        ----------------------------------------------------------------------------------------
        |   2.  | compareCredential   | Compares and matches email and password for validation |
        ----------------------------------------------------------------------------------------
		|   3.  | createNewCredential | Create new credential record in the collection         |
        ----------------------------------------------------------------------------------------
        |   4.  | updateCredential    | Update credential information in the collection        |
        ----------------------------------------------------------------------------------------
        |   5.  | deleteCredential    | Delete the credential from the collection              |
        ----------------------------------------------------------------------------------------
*/

/* importing required files and packages */
const bcrypt = require('bcrypt');
const randomString = require("randomstring");
const mongoDbCollection = require('../config/mongodb-collection');
const credentials = mongoDbCollection.credentials;

/* local functions */
//------ function to hash normal user's password
function generateHashedPassword(password) {
	return bcrypt.hashSync(password, 10);
}

/* exporting controllers apis */
module.exports = credentialsControllers = {

    //------------------------ fetch a credential information by email id
    getCredentialById: (email) => {
        return credentials().then((credentialsCollection) => {
            // returning a found json document else returning null
            return credentialsCollection.findOne({ _id:email }, { _id:1, password:1 });
        })
        .catch(() => {
            // returning a reject promise
            return Promise.reject("Server issue with 'credentials' collection.");
        });
    },


    //------------------------ compare the given credential
	compareCredential: (email, password) => {
		return credentials().then((credentialsCollection) => {
            // finding passed email id document
			return credentialsCollection.findOne({ _id:email }, { _id:1, password:1 })
				.then((credentialInfo) => {

					// validating passwords
					if (bcrypt.compareSync(password, credentialInfo.password)) {
						return Promise.resolve("Password matched");
                    } else {
    					return Promise.reject("Incorrect Password");
                    }
				});
		},
        () => {
            // returning a reject promise
            return Promise.reject("Server issue with 'credentials' collection.");
        });
	},

    //------------------------ generate new credential (for forget password)
    generateCredential: ((email) => {
        return credentials().then((credentialsCollection) => {
            
            let genPassword = randomString.generate(6);     // generating random string
            
            // update new credential object (empty)
            let credentialChanges = { };
                credentialChanges['password'] = generateHashedPassword(genPassword);

            // updating credential information into the collection
            credentialsCollection.updateOne( { _id:email }, { $set:credentialChanges });
            return genPassword;     // returning created password
        })
        .catch(() => {
            // returning a reject promise
            return Promise.reject("Server issue with 'credentials' collection.");
        });
    }),

    //------------------------ insert/create a new credential record
    createNewCredential: (email, password) => {
        return credentials().then((credentialsCollection) => {

            // new credential object
            let newCredential = {
                _id: email,
				password: generateHashedPassword(password)
            }

            // adding a record in to the collection
            return credentialsCollection.insertOne(newCredential)
                .then((newCredentialInformation) => {
                    return newCredentialInformation.insertedId;
                })
                .then((newCredentialId) => {
                    // returning created credential document id
                    //return credentialsControllers.getCredentialById(newCredentialId);                    
                    return newCredentialId;
                });
        })
        .catch(() => {
            // returning a reject promise
            return Promise.reject("Server issue with 'credentials' collection.");
        });
    },


    //------------------------ update a credential information
    updateCredential: (email, password, savedPassword) => {
        return credentials().then((credentialsCollection) => {
            
            // update credential object (empty)
            let credentialChanges = { };

            // checking for values to update
            if(password) {
                // checking for same passwords
                if (bcrypt.compareSync(password, savedPassword)) {
                    console.log("Same Password");
                    return false;
                } else {
                    // saving the password after hashing it
                    credentialChanges['password'] = generateHashedPassword(password);
                    
                    // updating credential information into the collection
                    credentialsCollection.updateOne( { _id:email }, { $set:credentialChanges });
                    console.log("Password Updated");                        
                    return true;
                }
            }
        })
        .catch(() => {
            // returning a reject promise
            return Promise.reject("Server issue with 'credentials' collection.");
        });
    },

	
    //------------------------ delete a credential record of specific email id
    deleteCredential: (email) => {
        return credentials().then((credentialsCollection) => {
            // deleting a record
            return credentialsCollection.removeOne({ _id:email })
                .then((deletedCredentialInformation) => {
                    if (deletedCredentialInformation.deletedCount === 0) {
                        // returning a reject promise
                        return Promise.reject(`No result having email id '${email}' from credentials collection`);
                    }
                });
        })
        .catch(() => {
            // returning a reject promise
            return Promise.reject("Server issue with 'credentials' collection.");
        });
    }
};