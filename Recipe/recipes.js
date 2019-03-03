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

// @route   GET api/recipes/test
// @desc    Tests recipes route
// @access  Public
router.get("/test", (req, res) => {
  res.json({ msg: "Recipes works" });
});

// @route   POST /recipes
// @desc    Create recipe
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateRecipeInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newRecipe = new Recipe({
      name: req.body.name,
      time: req.body.time,
      author: req.user.id,
      description: req.body.description
    });

    if (req.body.vegetarian) {
      newRecipe.vegetarian = true;
    }
    if (req.body.vegan) {
      newRecipe.vegan = true;
    }
    if (req.body.glutenfree) {
      newRecipe.glutenfree = true;
    }

    try {
      const recipe = await newRecipe.save();
      return res.status(200).json(recipe);
    } catch (e) {
      return res.status(500).json({ error: "Unknown server error" });
    }
  }
);

// @route   GET /recipes
// @desc    Get all recipes
// @access  Public
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    if (recipes.length === 0) {
      return res.status(404).json({ notfound: "Recipes not found" });
    }
    return res.status(200).json(recipes);
  } catch (e) {
    return res.status(500).json({ error: "Unknown server error" });
  }
});

// @route   POST api/recipes/ingredients/:id
// @desc    Add ingredient to recipe
// @access  Private
// router.post("/ingredients", passport.authenticate("jwt", { session: false }), async (req, res) => {
//   const { errors, isValid } = validateIngredientsInput(req.body);

//   if(!isValid){
//     return res.status(400).json(errors);
//   }

//   const recipeId = req.body.id
// })

module.exports = router;
