const validators = require("./index");

function validateInput(input, minLength, minDigits, minSpecials, maxLength) {
  const problemList = [];
  if (validators.minimumDigitsHandler(input, minDigits)) {
    problemList.push(`Password should have at least ${minDigits} digits.\n`);
  }
  if (validators.minimumSpecialsHandler(input, minSpecials)) {
    problemList.push(
      `Password should have at least ${minSpecials} special characters.\n`
    );
  }
  if (validators.minimumUppercaseHandler(input, minDigits)) {
    problemList.push(
      `Password should have at least ${minDigits} uppercase letters.\n`
    );
  }
  if (validators.minimumLowercaseHandler(input, minDigits)) {
    problemList.push(
      `Password should have at least ${minDigits} lowercase letters.\n`
    );
  }
  if (validators.recurringCharacterHandler(input)) {
    problemList.push(`Password should not have any recurring characters.\n`);
  }
  if (validators.maximumLengthHandler(input, maxLength)) {
    problemList.push(`Password should not exceed ${maxLength} characters.\n`);
  }
  if (validators.minimumLengthHandler(input, minLength)) {
    problemList.push(`Password should be at least ${minLength} characters.\n`);
  }
  return problemList;
}

module.exports = validateInput;
