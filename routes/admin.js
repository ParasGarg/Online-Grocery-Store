/* 
 * Admin Routers *
 * This route file contains all apis for admin operations
 * Functionalities Index: 
        ========================================================================================================
        | S.No. |  Type  |         URL        |   Function Call   |    Fn Path    |         Description        |
        ========================================================================================================
        |   1.  | Get    | /admin/users/      | getUserById       | users         | Search user from it's id   |
        --------------------------------------------------------------------------------------------------------
        |   2.  | Get    | /admin/users/list  | getAllUsers       | users         | Search all users           |
        --------------------------------------------------------------------------------------------------------
        |   3.  | Delete | /admin/users/:id   | deleteUser        | users         | Delete a user record       |
        --------------------------------------------------------------------------------------------------------
        |   4.  | Delete | /admin/creds/:id   | deleteCredential  | credentials   | Delete a credential record |
        --------------------------------------------------------------------------------------------------------
*/

/* importing required files and packages */
const express = require('express');
const router = express.Router();
const data = require('../data');
const usersData = data.users;
const credentialsData = data.credentails;

/* routes for user collection operations */
// route to fetch user information by id
router.get('/user/id/:id', (req, res) => {
    usersData.getUserById(req.params.id).then((userInfo) => {
        
        if (userInfo == null) {
            res.status(400).json({ error: "Not a valid id" });
        }

        res.json(userInfo);
        //res.render('checker/results', { check: checkPhrases })        
    }).catch(() => {
        res.status(500).json({ error: "Server issue with users collection" });
    });
});

// route to fetch information for all users 
router.get('/user/list', (req, res) => {
    usersData.getAllUsers().then((usersInfo) => {
        res.json(usersInfo);        
    }).catch(() =>{
        res.status(404).json({ error: "No user records" });
    });
});

// route to delete user information by id
router.delete('/user/id/:id', (req, res) => {
    usersData.getUserById(req.params.id).then(() => {
        usersData.deleteUser(req.params.id).then(() => {
            res.status(200).send(`Pharse of id ${req.params.id} has been deleted`);
        }, (err) => {
            res.status(500).json({ error: err });            
        });
    }). catch(() => {
        res.status(404).json({ error: "No such user exists" });
    });
});

// route to delete credential information by id
router.delete('/user/creds/:id', (req, res) => {
    credentialsData.getCredentialById(req.params.id).then(() => {
        credentialsData.deleteCredential(req.params.id).then(() => {
            res.status(200).send(`Pharse of id ${req.params.id} has been deleted`);
        }, (err) => {
            res.status(500).json({ error: err });            
        });
    }). catch(() => {
        res.status(404).json({ error: "No such user exists" });
    });
});

// exporting routing apis
module.exports = router;