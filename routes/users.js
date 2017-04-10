/* 
 * Users Routers *
 * This route file contains all apis for basic user operations
 * Functionalities Index: 
        =======================================================================================
        | S.No. |  Type  |    URL    |   Function Call   | Fn Path |       Description        |
        =======================================================================================
        |   1.  | Get    | /user/:id | getUserById       | users   | Search user from it's id |
        ---------------------------------------------------------------------------------------
        |   2.  | Post   | /user/new | createNewUser     | users   | Insert new user record   |
        ---------------------------------------------------------------------------------------
        |   3.  | Put    | /user/:id | updateUserProfile | users   | Update user profile info |
        ---------------------------------------------------------------------------------------
*/

/* importing required files and packages */
const express = require('express');
const router = express.Router();
const data = require('../data');
const usersData = data.users;
const credentialsData = data.credentails;

// route to fetch user information by id
router.get('/:id', (req, res) => {
    usersData.getUserById(req.params.id).then((userInfo) => {
        res.json(userInfo);
        //res.render('checker/results', { check: checkPhrases })        
    }).catch(() => {
        res.status(404).json({ error: "Not a valid id" });
    });
});

// route to create new user into database
router.post('/new', (req, res) => {
    let newUser = req.body;

    // checking null values
    if(!newUser.name) {
        res.status(400).json({ error: "Please provide your name." });
        return;
    } else if (!newUser.email) {
        res.status(400).json({ error: "Please provide your email id." });
        return;
    } else if (!newUser.mobile) {
        res.status(400).json({ error: "Please provide your contact number." });
        return;
    } else if (!newUser.password) {
        res.status(400).json({ error: "Please provide your account password." });
        return;
    }  else if (!newUser.image) {
        newUser.image = null;
    }

    // searching for an existing id
    usersData.getUserById(newUser.email).then((userJsonDocument) => {
        
        if (userJsonDocument == null) {     // no user document found
            // creating new json document in users collection 
            usersData.createNewUser(newUser.name, newUser.email, newUser.mobile, newUser.image).then((userInfo) => {

                if (userInfo != null) {     // newly created user document found
                    // creating new json document in credentials collection
                    credentialsData.createNewCredential(newUser.email, newUser.password).then((userCredential) => {
                        res.status(200).json(userCredential);
                    });
                } else {
                    res.status(500).json({ error: "Users collection error in creating new documents." })
                }
            }).catch(() => {
                res.status(404).json({ error: "Invalid user input stream." });
            });
        } else {                            // user document found
            res.status(400).json({ error: "User is already registered." });
        }

    }, (collectionError) => {
        res.status(500).json({ error: collectionError });
    });
});

// rute to update user information by id
router.put('/:id', (req, res) => {
    let userUpdates = req.body;

    // checking for empty json
    if (Object.keys(userUpdates).length === 0) {
        res.status(400).json({ error: "No data to update" });
        return;
    }

    usersData.getUserById(req.params.id).then((userJsonDocument) => {
        
        if (userJsonDocument != null) {     // user document exists
            // update new json document in users collection
            usersData.updateUserProfile(req.params.id, userUpdates).then((updates) => {
                res.status(200).json(updates);
            });
        } else {
            res.status(400).json({ error: "No user exists to update" })
        }
    
    }, (collectionError) => {
        res.status(500).json({ error: collectionError });
    });
});

// exporting routing apis
module.exports = router;