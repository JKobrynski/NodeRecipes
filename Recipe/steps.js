const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Bring in models
const Recipe = require("./Recipe-model");

// Bring in validation
const validateStepInput = require("../validation/steps");

// @route   POST /
// @desc    Add step to recipe (+ at specified index)
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateStepInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    try {
      const recipe = await Recipe.findOne({
        author: req.user.id,
        _id: req.body.recId
      });
      if (!recipe) {
        errors.recipe = "Recipe not found";
        return res.status(404).json(errors);
      }

      const newStep = {
        body: req.body.body
      };

      if (typeof req.body.index === "string") {
        // Adding at specified index
        // TODO: async/await
        recipe.steps.splice(req.body.index, 0, newStep);
        recipe.save().then(recipe => res.status(200).json(recipe));
      } else {
        // Adding at the end
        // TODO: async/await
        recipe.steps.push(newStep);

        recipe.save().then(recipe => res.status(200).json(recipe));
      }
    } catch (e) {
      return res.status(500);
    }
  }
);

// @route   DELETE /
// @desc    Delete step
// @access  Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (typeof req.body.recId !== "string") {
      return res.status(400).json({ noid: "Recipe id not provided" });
    }

    if (typeof req.body.stepId !== "string") {
      return res.status(400).json({ nostep: "Step id not provided" });
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
      const removeIndex = recipe.steps
        .map(item => item.id)
        .indexOf(req.body.stepId);

      // Delete from array
      recipe.steps.splice(removeIndex, 1);

      // Save
      const rec = await recipe.save();
      res.status(200).json(rec);

      //recipe.save().then(recipe => res.json(recipe));
    } catch (e) {
      return res.status(500);
    }
  }
);

module.exports = router;
