/* imporing useful files and libraries */
// authentication using passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// data modules
const data = require('../data');
const usersData = data.users;
const credentialsData = data.credentials;

// passport configuration
passport.use('admin', new LocalStrategy({ usernameField:"email", passwordField:"password" }, (email, password, done) => {
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

/*
// use two LocalStrategies, registered under user and company names
passport.use('user', new LocalStrategy(
  function(username, password, done) {
    User.findOne( ... )
  }
));

passport.use('company', new LocalStrategy(
  function(username, password, done) {
    Company.findOne( ... )
  }
));


// authenticate using local strategies, depending on whether the route is the user or company interface
app.post('/user/login', 
  passport.authenticate('user', { successRedirect: '/user/home', failureRedirect: '/user/login' }));

app.post('/company/login', 
  passport.authenticate('company', { successRedirect: '/company/home', failureRedirect: '/company/login' }));
*/