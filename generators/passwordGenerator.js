const crypto = require("crypto");

const CHAR_SETS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  special: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

/**
 * Generate a cryptographically secure password based on specified criteria
 * @param {Object} options Password generation options
 * @param {number} options.minLength Minimum password length (default: 12)
 * @param {number} options.maxLength Maximum password length (default: 32)
 * @param {number} options.minDigits Minimum number of digits (default: 1)
 * @param {number} options.minSpecial Minimum number of special characters (default: 1)
 * @param {number} options.minUppercase Minimum number of uppercase letters (default: 1)
 * @param {number} options.minLowercase Minimum number of lowercase letters (default: 1)
 * @param {boolean} options.noRecurring Whether to disallow recurring characters (default: false)
 * @returns {string} Generated password meeting the criteria
 */
function generatePassword(options = {}) {
  const {
    minLength = 12,
    maxLength = 32,
    minDigits = 1,
    minSpecial = 1,
    minUppercase = 1,
    minLowercase = 1,
    noRecurring = false,
  } = options;

  // Validate inputs
  if (minLength > maxLength) {
    throw new Error("minLength cannot be greater than maxLength");
  }

  const minRequiredLength = minDigits + minSpecial + minUppercase + minLowercase;
  if (minLength < minRequiredLength) {
    throw new Error(
      `minLength (${minLength}) must be at least the sum of minimum requirements (${minRequiredLength})`
    );
  }

  // Helper function to get random integer in range [min, max]
  const getRandomInt = (min, max) => {
    const range = max - min + 1;
    const bytes = crypto.randomBytes(4);
    const max_range = Math.floor((2 ** 32) / range) * range;
    let val;
    do {
      val = bytes.readUInt32BE(0);
    } while (val >= max_range);
    return min + (val % range);
  };

  // Helper function to get random character from a string
  const getRandomChar = (str) => str[getRandomInt(0, str.length - 1)];

  // Helper function to shuffle array using Fisher-Yates algorithm
  const shuffle = (array) => {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = getRandomInt(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  const generateValidPassword = () => {
    // Calculate random password length between min and max
    const length = getRandomInt(minLength, maxLength);

    // Start with minimum required characters
    const chars = [
      ...Array(minDigits).fill().map(() => getRandomChar(CHAR_SETS.digits)),
      ...Array(minSpecial).fill().map(() => getRandomChar(CHAR_SETS.special)),
      ...Array(minUppercase).fill().map(() => getRandomChar(CHAR_SETS.uppercase)),
      ...Array(minLowercase).fill().map(() => getRandomChar(CHAR_SETS.lowercase)),
    ];

    // Fill remaining length with random characters from all sets
    const allChars = Object.values(CHAR_SETS).join("");
    while (chars.length < length) {
      chars.push(getRandomChar(allChars));
    }

    // Shuffle the characters
    return shuffle(chars).join("");
  };

  // Generate passwords until we get one that meets all criteria
  let password;
  let attempts = 0;
  const MAX_ATTEMPTS = 100;

  do {
    password = generateValidPassword();
    attempts++;

    if (attempts >= MAX_ATTEMPTS) {
      throw new Error(
        "Failed to generate a password meeting all criteria after maximum attempts"
      );
    }
  } while (
    noRecurring &&
    /(.).*\1/.test(password) // Check for recurring characters
  );

  return password;
}

module.exports = generatePassword;
