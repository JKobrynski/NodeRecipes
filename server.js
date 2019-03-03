const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const app = express();

// TODO: Bring in route files
const users = require("./User/users");
const recipes = require("./Recipe/recipes");
const ingredients = require("./Recipe/ingredients");
const steps = require("./Recipe/steps");

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Database config
const db = require("./config/keys").mongoURI;

// Connecting to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// TODO: Use routes
app.use("/users", users);
app.use("/recipes", recipes);
app.use("/ingredients", ingredients);
app.use("/steps", steps);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}.`));
