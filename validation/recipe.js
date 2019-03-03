const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRecipeInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.time = !isEmpty(data.time) ? data.time : "";
  data.description = !isEmpty(data.description) ? data.description : "";

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  if (Validator.isEmpty(data.time)) {
    errors.time = "Time field is required";
  }

  if (Validator.isEmpty(data.description)) {
    errors.description = "Description field is required";
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
