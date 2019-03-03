const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateIngredientsInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.quantity = !isEmpty(data.quantity) ? data.quantity : "";

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  if (Validator.isEmpty(data.quantity)) {
    errors.quantity = "Quantity field is required";
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
