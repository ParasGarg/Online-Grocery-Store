/* imporing useful files and libraries */
// authentication using passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// data modules
const data = require('../data');
const usersData = data.users;
const credentialsData = data.credentials;

// passport configuration
passport.use(new LocalStrategy( {  }, (email, password, done) => {

console.log(1);

    credentialsData.getCredentialById(email).then((userCredentials) => {

console.log(2);
      
        credentialsData.compareCredential(email, password).then(() => {

console.log(3);

            return done(null, userCredentials);
        }, (err) => {

console.log(4);

            return done(null, false, { message: err });
        });
    }, (err) => {

console.log(5);
    
        return done(null, false, { message: err });
    });
}));

// user serializer or deserializer for maintaining cookies and sessions
passport.serializeUser(function(user, done) {               // user is receiving all user credentials from above

console.log(6);
  
  done(null, user._id);
});

passport.deserializeUser(function(userId, done) {           // getting user id from above

console.log(7);

  usersData.getUserById(userId).then((user) => {

console.log(8);
  
    done(null, user);
  }, (err) => {      
  
console.log(9);

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