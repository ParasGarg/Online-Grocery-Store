/* imporing useful files and libraries */
// authentication using passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// data modules
const data = require('../data');
const usersData = data.users;
const credentialsData = data.credentials;

// passport configuration
passport.use('user', new LocalStrategy({ usernameField:"email", passwordField:"password" }, (email, password, done) => {
    credentialsData.getCredentialById(email).then((userCredentials) => {

        // validating received user information
        if (userCredentials != null) {
            // comparing provided email and password
            credentialsData.compareCredential(email, password).then(() => {
                // returning success results
                return done(null, userCredentials);
            }) 
            .catch((passwordError) => {
                // returning incorrect password error
                return done(null, false, { message: passwordError });
            });

      } else {
          // returning unregistered user error
          return done(null, false, { message: "User is not registered." });
      }

    })
    .catch((serverError) => {
        // returning server error
        return done(null, false, { message: serverError });
    });
}));

// user serializer or deserializer for maintaining cookies and sessions
passport.serializeUser(function(user, done) {               // user is receiving all user credentials from above
    done(null, user._id);
});

passport.deserializeUser(function(userId, done) {           // getting user id from above
    usersData.getUserById(userId).then((user) => {
        done(null, user);
    }) 
    .catch((err) => {      
        done(null, false, { message: err });
   });
});

// exporting passport
module.exports = passport;