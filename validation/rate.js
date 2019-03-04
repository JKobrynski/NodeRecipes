const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRateInput(data) {
  let errors = {};

  data.grade = !isEmpty(data.grade) ? data.grade : "";
  data.recId = !isEmpty(data.recId) ? data.recId : "";

  if (Validator.isEmpty(data.grade)) {
    errors.grade = "Grade field is required";
  }

  if (Validator.isEmpty(data.recId)) {
    errors.recId = "Recipe id not provided";
  }

  if (!Validator.isInt(data.grade, { min: 0, max: 10 })) {
    errors.grade = "Grade must be between 0 and 10";
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
