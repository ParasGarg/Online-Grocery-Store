/* subscriptions collection
 *
 * Subscriptions Controllers *
 * This controller file contains all backend operations for subscriptions details
 * Controllers Index: 
        ===========================================================
        | S.No. |    Function Call    |          Actions          |
        ===========================================================
        |   1.  | getSubscriptionById | get/fetch record          |
        -----------------------------------------------------------
        |   2.  | addSubscription     | create/insert record      |
        -----------------------------------------------------------
        |   3.  | updateSubscription  | update/modify record      | 
        -----------------------------------------------------------
        |   4.  | removeSubscription  | deactive/update record    |
        -----------------------------------------------------------
*/

// importing required files and packages
const mongoDbCollection = require('../config/mongodb-collection');
const subscriptions = mongoDbCollection.subscriptions;

// exporting controllers apis
module.exports = subscriptionsControllers = {

    //------------------------ fetch a subscription information by email id
    getSubscriptionById: (email) => {
        return subscriptions().then((subscriptionsCollection) => {
            // returning a found json document else returning null
            return subscriptionsCollection.findOne({ _id:email }, { _id:1, activeStatus:1 })
                .then((subscriptionInfo) => {
                    return subscriptionInfo;
                }, () => {
                    return null;
                });
        })
        .catch(() => {
            // returning a reject promise
            return Promise.reject("Server issue with 'subscriptions' collection.");
        });
    },

    //------------------------ insert a subscription record
    addSubscription: (email) => {
        return subscriptions().then((subscriptionsCollection) => {

            let newSubscription = {
                _id: email,
                subscribedDate: new Date("2010-06-09T15:20:00Z").toUTCString(),
                activeStatus: true
            }

            // adding a record in to the collection
            return subscriptionsCollection.insertOne(newSubscription);
        })
        .catch(() => {
            // returning a reject promise
            return Promise.reject("Server issue with 'subscriptions' collection.");
        });
    },

    //------------------------ update a subscription record
    updateSubscription: (email) => {
        return subscriptions().then((subscriptionsCollection) => {

             // update subscription object (empty)
            let subscriptionChanges = { };

            subscriptionChanges['subscribedDate'] = new Date("2010-06-09T15:20:00Z").toUTCString();
            subscriptionChanges['activeStatus'] = true;

            // updating user information into the collection
            return subscriptionsCollection.updateOne({ _id:email }, { $set:subscriptionChanges })
                .then(() => {
                    return true;
                }, () => {
                    return false;
                });
        })
        .catch(() => {
            // returning a reject promise
            return Promise.reject("Server issue with 'subscriptions' collection.");
        });
    },

    //------------------------ delete a user record of specific id from users collection
    removeSubscription: (email) => {
        return subscriptions().then((subscriptionsCollection) => {

             // update subscription object (empty)
            let subscriptionChanges = { };
            subscriptionChanges['activeStatus'] = false;

            // updating user information into the collection
            return subscriptionsCollection.updateOne({ _id:email }, { $set:subscriptionChanges })
                .then(() => {
                    return true;
                }, () => {
                    return false;
                });
        })
        .catch(() => {
            // returning a reject promise
            return Promise.reject("Server issue with 'subscriptions' collection.");
        });   
    }
};