/* imporing useful files and libraries */
// authentication using passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const xss = require('xss');
// data modules
const data = require('../data');
const usersData = data.users;
const credentialsData = data.credentials;

// passport configuration
passport.use('user', new LocalStrategy({ usernameField:"email", passwordField:"password" }, (email, password, done) => {
    credentialsData.getCredentialById(xss(email)).then((userCredentials) => {

        if (userCredentials != null) {      // validating received document whether user exist or not
            credentialsData.compareCredential(xss(email), xss(password)).then(() => {
                return done(null, userCredentials);     // returning success results
            }) 
            .catch((passwordError) => {     // returning incorrect password error
                return done(null, false, { message: passwordError });
            });
      } else {  // returning unregistered user error
          return done(null, false, { message: "This email Id is not registered." });
      }
    })
    .catch((serverError) => {   // returning server error
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
    .catch((error) => {      
        done(null, false, { message: error });
   });
});

// exporting passport
module.exports = passport;