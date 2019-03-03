const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Bring in models
const Recipe = require("./Recipe-model");

// Bring in validation
const validateIngredientsInput = require("../validation/ingredients");

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

//@route   TODO: DELETE /ingredients
//@desc    Delete ingredient
//@access  Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (typeof req.body.recId !== "string") {
      return res.status(400).json({ noid: "Recipe id not provided" });
    }
    if (typeof req.body.ingId !== "string") {
      return res
        .status(400)
        .json({ noingredient: "Ingredient id not provided" });
    }

    try {
      const recipe = await Recipe.findOne({
        author: req.user.id,
        _id: req.body.recId
      });
      if (!recipe) {
        return res.status(404).json({ notfound: "Recipe not found" });
      }

      // Get remove index
      const removeIndex = recipe.ingredients
        .map(item => item.id)
        .indexOf(req.body.ingId);

      // Remove from array
      recipe.ingredients.splice(removeIndex, 1);

      // Save
      const rec = await recipe.save();
      res.status(200).json(rec);
    } catch (e) {
      return res.status(500);
    }
  }
);

module.exports = router;
