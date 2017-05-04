/* importing node module files */
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const exphbs = require('express-handlebars');
const express = require('express');
const handlebars = require('handlebars');
const handlebarsIntl = require('handlebars-intl');
const handlebarsPaginate = require('handlebars-paginate');
const flash = require('connect-flash');
const passport = require('passport');

/* express server configuration */
const app = express();

/* session  configuration */
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(flash());
app.use(cookieParser());

/* passport authenticator initialization */
app.use(passport.initialize());
app.use(passport.session());

/* body parser configuration */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* static pages configuration */
const static = express.static(__dirname + '/public');
app.use("/public", static);

/* view or handlebars configuration */
handlebarsIntl.registerWith(handlebars);    // handlebars formatting
handlebars.registerHelper('paginate', handlebarsPaginate);  // paging
app.engine('handlebars', exphbs({ defaultLayout:'main' }));
app.set('view engine', 'handlebars');

/* routing configuration */
const configRoutes = require("./routes");
configRoutes(app);

/* running server on port 3000 */
app.listen(3000, () => {
    console.log("We've now got a server");
    console.log("Your routes will be running on http://localhost:3000");
});