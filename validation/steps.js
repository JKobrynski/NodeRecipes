const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateStepInput(data) {
  let errors = {};

  data.body = !isEmpty(data.body) ? data.body : "";

  if (Validator.isEmpty(data.body)) {
    errors.body = "Body field is required";
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
