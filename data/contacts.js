/* contacts collection
 *
 * Contacts Controllers *
 * This controller file contains all backend operations for contact-us details
 * Controllers Index: 
        ====================================================================================
        | S.No. |   Function Call   |                      Description                     |
        ====================================================================================
        |   1.  | addContact        | Create new contact record in the collection          |
        ------------------------------------------------------------------------------------
*/

// importing required files and packages
const uuid = require('uuid');
const mongoDbCollection = require('../config/mongodb-collection');
const contacts = mongoDbCollection.contacts;

// exporting controllers apis
module.exports = contactsControllers = {

    //------------------------ insert/create a new contact record
    addContact: (name, email, mobile, description) => {
        return contacts().then((contactsCollection) => {

            // new contact object
            let newContact = {
                _id: uuid.v4(),
                name: name,
				email: email,
                mobile: mobile,
                description: description,
                contactedDate: new Date("2010-06-09T15:20:00Z").toUTCString()
            }

            // adding a record in to the collection
            return contactsCollection.insertOne(newContact)
                .then(() => {
                    return true;
                }, () => {
                    return false;
                })
        })
        .catch(() => {
            // returning a reject promise
            return Promise.reject("Server issue with 'contacts' collection.");
        });        
    },
};