const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create recipe schema
const RecipeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  description: {
    type: String,
    required: true
  },
  ingredients: [
    {
      name: {
        type: String,
        required: true
      },
      quantity: {
        type: String,
        required: true
      }
    }
  ],
  steps: [
    {
      body: {
        type: String,
        required: true
      }
    }
  ],
  vegetarian: {
    type: Boolean,
    default: false
  },
  vegan: {
    type: Boolean,
    default: false
  },
  glutenfree: {
    type: Boolean,
    default: false
  },
  rating: [
    {
      grade: {
        type: Number,
        require: true
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    }
  ]
});

module.exports = Recipe = mongoose.model("recipe", RecipeSchema);
