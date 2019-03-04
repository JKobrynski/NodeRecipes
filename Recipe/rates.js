const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Bring in models
const Recipe = require("./Recipe-model");

// Bring in validation
const validateRateInput = require("../validation/rate");

// @route   POST /rates
// @desc    Rate a recipe
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateRateInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    try {
      const recipe = await Recipe.findById(req.body.recId);
      if (!recipe) {
        errors.recipe = "Recipe not found";
        return res.status(404).json(errors);
      } else {
        const newRate = {
          grade: req.body.grade,
          user: req.user.id
        };

        // Get update index if user already rated this recipe
        const updateIndex = recipe.rating
          .map(item => item.user.toString())
          .indexOf(req.user.id);

        if (updateIndex >= 0) {
          // Updating
          recipe.rating.splice(updateIndex, 1, newRate);
        } else {
          // Creating
          recipe.rating.unshift(newRate);
        }

        const rec = await recipe.save();
        res.status(200).json(rec);
      }
    } catch (e) {
      return res.status(500);
    }
  }
);

// @route   GET /rates
// @desc    Get all rates for one recipe
// @access  Public
router.get("/", async (req, res) => {
  if (typeof req.body.recId !== "string") {
    return res.status(400).json({ noid: "Recipe id not provided" });
  }
  try {
    const recipe = await Recipe.findById(req.body.recId);
    if (!recipe) {
      return res.status(404).json({ notfound: "Recipe not found" });
    }
    return res.status(200).json(recipe.rating);
  } catch (e) {
    return res.status(500);
  }
});

module.exports = router;
