const yargs = require("yargs");
const colors = require("./colors"); // Assuming colors is correctly set up
const readCpc = require("./config/configReader"); // Adjust the path as needed

/**
 * Validate if the input password meets the criteria
 * @param {string} input - The password to check
 * @param {number} minLength - The minimum length of the password
 * @param {number} minDigits - The minimum number of digits in the password
 * @param {number} minSpecials - The minimum number of special characters in the password
 * @returns {boolean} - True if the password is valid, false otherwise
 * @returns {boolean} - True if the password is valid, false otherwise
 */
function validateInput(input, minLength, minDigits, minSpecials) {
  if (input.length < minLength) {
    console.log(
      `${colors.Fg.Red}Password is too short. Minimum length required is ${minLength}.${colors.Reset}`
    );
    return false;
  }

  let digitCount = 0,
    specialCharCount = 0;

  for (let char of input) {
    if (/\d/.test(char)) digitCount++;
    if (/\W|_/.test(char)) specialCharCount++;
  }

  if (digitCount < minDigits) {
    console.log(
      `${colors.Fg.Red}Password should contain at least ${minDigits} digits.${colors.Reset}`
    );
    return false;
  }

  if (specialCharCount < minSpecials) {
    console.log(
      `${colors.Fg.Red}Password should contain at least ${minSpecials} special characters.${colors.Reset}`
    );
    return false;
  }

  return true;
}

/**
 * Handle the `check` command
 * @param {object} argv - The parsed arguments
 */
function handleCheckCommand(argv) {
  let minLength, minDigits, minSpecials, password;

  if (argv.config) {
    console.log(`Reading config from: ${argv.config}`);
    const config = readCpc(argv.config);
    minLength = parseInt(config.minLength, 10);
    minDigits = parseInt(config.minDigits, 10);
    minSpecials = parseInt(config.minSpecials, 10);
    password = argv.password;
  } else {
    minLength = argv.minLength;
    minDigits = argv.minDigits;
    minSpecials = argv.minSpecials;
    password = argv.password;
  }

  if (!password) {
    console.error(
      `${colors.Fg.Red}The --password argument is required.${colors.Reset}`
    );
    process.exit(1);
  }

  const res = validateInput(password, minLength, minDigits, minSpecials);
  if (res) console.log(`${colors.Fg.Green}Password is valid${colors.Reset}`);
}

const argv = yargs
  .command({
    command: "check",
    describe: "Check if the input password meets the criteria",
    builder: {
      config: {
        describe: "Path to the config file",
        type: "string",
      },
      minLength: {
        describe: "Minimum length of the password",
        type: "number",
      },
      minDigits: {
        describe: "Minimum number of digits in the password",
        type: "number",
      },
      minSpecials: {
        describe: "Minimum number of special characters in the password",
        type: "number",
      },
      password: {
        describe: "Password to check",
        demandOption: true,
        type: "string",
      },
    },
    handler: handleCheckCommand,
  })
  .help().argv;
