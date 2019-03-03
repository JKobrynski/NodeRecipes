const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const passport = require("passport");

// Load input validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

// Load user model
const User = require("./User-model");

// @route   GET /users/test
// @desc    Tests users route
// @access  Public
router.get("/test", async (req, res) => {
  try {
    res.status(200).json({ success: "Users works" });
  } catch (e) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// @route   POST /users
// @desc    Register
// @access  Public
router.post("/", async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    // Check if email already exists in database
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      // bcrypt.genSalt(10, (err, salt) => {
      //   bcrypt.hash(newUser.password, salt, (err, hash) => {
      //     if (err) throw err;
      //     newUser.password = hash;

      //     newUser
      //       .save()
      //       .then(user => res.json(user))
      //       .catch(err => console.log(err));
      //   });
      // });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, async (err, hash) => {
          if (err) throw err;
          newUser.password = hash;

          try {
            const user = await newUser.save();
            return res.status(200).json(user);
          } catch (e) {
            return res.status(500);
          }
        });
      });
    }
  } catch (e) {
    return res.status(500).json({ error: "Db error" });
  }
});

// @route   POST /users/login
// @desc    Login
// @access  Public
router.post("/login", async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  try {
    // Find user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // User matched
      // Create jwt payload
      const payload = { id: user.id, name: user.name };

      // Sign token
      try {
        const token = await jwt.sign(payload, keys.secretOrKey, {
          expiresIn: 3600
        });
        res.json({ success: true, token: "Bearer " + token });
      } catch (e) {
        return res.status(500);
      }
    } else {
      // User not matched
      errors.password = "Password incorrect";
      return res.status(400).json(errors);
    }
  } catch (e) {
    return res.status(500);
  }
});

// @route   GET /users/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
