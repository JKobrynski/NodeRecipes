const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Bring in models
const Recipe = require("./Recipe-model");

// Bring in validation
const validateRecipeInput = require("../validation/recipe");
const validateIngredientsInput = require("../validation/ingredients");
const validateStepInput = require("../validation/steps");
const validateRateInput = require("../validation/rate");

// @route   GET /test
// @desc    Test route
// @access  Public
router.get("/test", (req, res) => {
  res.status(200).json({ success: true });
});

//@route   POST /ingredients
//@desc    Add ingredient to recipe
//@access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateIngredientsInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const recipeId = req.body.id;
    let query = { author: req.user.id, _id: recipeId };

    try {
      const recipe = await Recipe.findOne(query);
      if (!recipe) {
        errors.recipe = "Recipe not found";
        errors.user = "You can only edit your own recipes";
        return res.status(400).json(errors);
      }

      const newIngredient = {
        name: req.body.name,
        quantity: req.body.quantity
      };

      // Add ingredient to array
      recipe.ingredients.unshift(newIngredient);

      // Save
      try {
        const rec = await recipe.save();
        return res.status(200).json(rec);
      } catch (e) {
        return res.status(500).json({ error: "Unknown server error" });
      }
    } catch (e) {}
  }
);

module.exports = router;
