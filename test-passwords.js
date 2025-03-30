const generatePassword = require('./generators/passwordGenerator');

// Generate some test passwords
const passwords = [
  // Generated passwords
  generatePassword(), // Default options
  generatePassword({ minLength: 16, minDigits: 3, minSpecial: 2 }),
  generatePassword({ maxLength: 12, noRecurring: true }),
  
  // Known passwords (some valid, some invalid)
  'short1!',         // Too short
  'nodigits!!',     // No digits
  'NoSpecials123',  // No special chars
  'Valid1Password!', // Should be valid
  '12345678',       // Only digits
  'abcdefgh',       // Only lowercase
  'ABCDEFGH',       // Only uppercase
  '!@#$%^&*',       // Only special chars
];

console.log('Testing passwords with default config file...\n');

const { execSync } = require('child_process');

passwords.forEach((password, index) => {
  console.log(`\nTesting password ${index + 1}: ${password}`);
  try {
    const output = execSync(
      `node index.js check --password "${password}" --config "./config/example.cpc"`,
      { encoding: 'utf8' }
    );
    console.log(output);
  } catch (error) {
    console.log(error.output.toString());
  }
});
