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
    } else if (!newUser.image) {
        newUser.image = null;
    }

    // searching for an existing id
    usersData.getUserById(newUser.email).then((userInfoFound) => {
        
        if (userInfoFound == null) {
            usersData.createNewUser(newUser.name, newUser.email, newUser.mobile, newUser.image).then((userInfo) => {
                res.json(userInfo);
            }).catch(() => {
                res.status(404).json({ error: "Invalid input stream" });
            });
        } else {
            res.status(400).json({ error: "Registered user" });
        }

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

    usersData.getUserById(req.params.id).then(() => {
        usersData.updateUserProfile(req.params.id, userUpdates).then((updates) => {
            res.json(updates);
        }, (err) => {
            res.status(500).json({ error: err });
        });
    }).catch(() => {
        res.status(404).json({ error: "No user found." });
    });
});

// exporting routing apis
module.exports = router;