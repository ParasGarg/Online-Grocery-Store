/* express server configuration */
const express = require("express");
const app = express();

/* static pages configuration */
const static = express.static(__dirname + '/public');
app.use("/public", static);

/* body parser configuration */
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* express handlebars configuration */
const exphbs = require("express-handlebars");
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