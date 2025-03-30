const validators = require("./index");

/**
 * Validates a password against specified criteria
 * @param {string} password - The password to validate
 * @param {number} minLength - Minimum password length
 * @param {number} minDigits - Minimum number of digits required
 * @param {number} minSpecial - Minimum number of special characters required
 * @param {number} maxLength - Maximum password length
 * @param {number} minUppercase - Minimum number of uppercase letters required
 * @param {number} minLowercase - Minimum number of lowercase letters required
 * @param {boolean} noRecurring - Whether to disallow recurring characters
 * @returns {string[]} - Array of validation error messages, empty if password is valid
 */
function validateInput(
  password,
  minLength,
  minDigits,
  minSpecial,
  maxLength,
  minUppercase,
  minLowercase,
  noRecurring
) {
  const errors = [];

  // Check minimum length
  if (validators.minimumLengthHandler(password, minLength)) {
    errors.push(
      `- Password must be at least ${minLength} characters long\n`
    );
  }

  // Check maximum length
  if (validators.maximumLengthHandler(password, maxLength)) {
    errors.push(
      `- Password must be at most ${maxLength} characters long\n`
    );
  }

  // Check minimum digits
  if (validators.minimumDigitsHandler(password, minDigits)) {
    errors.push(
      `- Password must contain at least ${minDigits} digit(s)\n`
    );
  }

  // Check minimum special characters
  if (validators.minimumSpecialsHandler(password, minSpecial)) {
    errors.push(
      `- Password must contain at least ${minSpecial} special character(s)\n`
    );
  }

  // Check minimum uppercase letters
  if (validators.minimumUppercaseHandler(password, minUppercase)) {
    errors.push(
      `- Password must contain at least ${minUppercase} uppercase letter(s)\n`
    );
  }

  // Check minimum lowercase letters
  if (validators.minimumLowercaseHandler(password, minLowercase)) {
    errors.push(
      `- Password must contain at least ${minLowercase} lowercase letter(s)\n`
    );
  }

  // Check for recurring characters if noRecurring is true
  if (noRecurring && validators.recurringCharacterHandler(password)) {
    errors.push(
      `- Password must not contain recurring characters\n`
    );
  }

  return errors;
}

module.exports = validateInput;
