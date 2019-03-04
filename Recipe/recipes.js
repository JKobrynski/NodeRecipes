const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Bring in models
const Recipe = require("./Recipe-model");

// Bring in validation
const validateRecipeInput = require("../validation/recipe");

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
// @desc    Get all/filtered recipes
// @access  Public
router.get("/", async (req, res) => {
  let sort = {};
  let filter = {};

  if (typeof req.query.sort === "string") {
    if (req.query.sort === "date") {
      sort = { date: 1 };
    } else if ((req.query.sort = "revdate")) {
      sort = { date: -1 };
    }
  }

  if (typeof req.query.author === "string") {
    filter.author = req.query.author;
  }

  if (typeof req.query.gf === "string") {
    filter.glutenfree = true;
  }

  if (typeof req.query.vegan === "string") {
    filter.vegan = true;
  }

  if (typeof req.query.vege === "string") {
    filter.vegetarian = true;
  }

  try {
    const recipes = await Recipe.find(filter, null, { sort: sort });
    if (recipes.length === 0) {
      return res.status(404).json({ notfound: "Recipes not found" });
    }
    return res.status(200).json(recipes);
  } catch (e) {
    return res.status(500).json({ error: "Unknown server error" });
  }
});

// @route   DELETE /recipes
// @desc    Delete recipe
// @access  Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const recipe = await Recipe.findOneAndRemove({
        author: req.user.id,
        _id: req.body.recId
      });
      if (recipe) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(404).json({ notfound: "Recipe not found" });
      }
    } catch (e) {
      return res.status(500).json({ error: "Unknown server error" });
    }
  }
);

module.exports = router;
