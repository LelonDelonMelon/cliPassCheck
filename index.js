const yargs = require("yargs");
const colors = require("./colors");
const readCpc = require("./config/configReader");
const generatePassword = require("./generators/passwordGenerator");
const validateInput = require("./validators/passwordValidator");

/**
 * Get configuration from either config file or command line arguments
 */
async function getConfig(argv) {
  // If command line arguments are provided, use them
  if (argv.minLength || argv.minDigits || argv.minSpecials || argv.maxLength || 
      argv.minUppercase || argv.minLowercase || argv.noRecurring) {
    return {
      minLength: parseInt(argv.minLength, 10) || 8,
      minDigits: parseInt(argv.minDigits, 10) || 1,
      minSpecial: parseInt(argv.minSpecials, 10) || 1,
      maxLength: parseInt(argv.maxLength, 10) || 32,
      minUppercase: parseInt(argv.minUppercase, 10) || 1,
      minLowercase: parseInt(argv.minLowercase, 10) || 1,
      noRecurring: argv.noRecurring === true || argv.noRecurring === "true",
    };
  }

  // If no command line arguments, try to use config file
  if (!argv.config) {
    console.error(
      `${colors.Fg.Red}Either provide command line arguments or use --config with a .cpc config file.${colors.Reset}`
    );
    process.exit(1);
  }

  console.log(`Reading config from: ${argv.config}`);
  try {
    const config = await readCpc(argv.config);
    return {
      minLength: parseInt(config.minLength, 10) || 8,
      minDigits: parseInt(config.minDigits, 10) || 1,
      minSpecial: parseInt(config.minSpecials, 10) || 1,
      maxLength: parseInt(config.maxLength, 10) || 32,
      minUppercase: parseInt(config.minUppercase, 10) || 1,
      minLowercase: parseInt(config.minLowercase, 10) || 1,
      noRecurring: config.noRecurring === true || config.noRecurring === "true",
    };
  } catch (e) {
    console.error(
      `${colors.Fg.Red}Error reading config file: ${e.message}${colors.Reset}`
    );
    process.exit(1);
  }
}

/**
 * Handle the `validate` command
 */
async function handleValidateCommand(argv) {
  const password = argv.password;
  if (!password) {
    console.error(
      `${colors.Fg.Red}The --password argument is required for validation.${colors.Reset}`
    );
    process.exit(1);
  }

  try {
    const config = await getConfig(argv);
    const {
      minLength,
      minDigits,
      minSpecial,
      maxLength,
      minUppercase,
      minLowercase,
      noRecurring,
    } = config;

    const res = validateInput(
      password,
      minLength,
      minDigits,
      minSpecial,
      maxLength,
      minUppercase,
      minLowercase,
      noRecurring
    );

    if (res.length === 0) {
      console.log(`${colors.Fg.Green}Password is valid${colors.Reset}`);
    } else {
      console.error(
        `${colors.Bg.Red}Password is invalid. Check the following requirements:${colors.Reset}`
      );
      console.error(`${colors.Fg.Red}\n${res.join("")}${colors.Reset}`);
      process.exit(1);
    }
  } catch (e) {
    console.error(
      `${colors.Fg.Red}Error occurred: ${e.message}${colors.Reset}`
    );
    process.exit(1);
  }
}

/**
 * Handle the `generate` command
 */
async function handleGenerateCommand(argv) {
  try {
    const config = await getConfig(argv);
    const generatedPassword = generatePassword(config);
    console.log(
      `${colors.Fg.Green}Generated Password: \n${colors.Underscore}${generatedPassword}${colors.Reset}`
    );
  } catch (error) {
    console.error(
      `${colors.Fg.Red}Failed to generate password: ${error.message}${colors.Reset}`
    );
    process.exit(1);
  }
}

// Common options for both commands
const commonOptions = {
  config: {
    describe: "Path to the config file",
    type: "string",
  },
};

yargs
  .command({
    command: "validate",
    describe: "Validate a password",
    builder: {
      ...commonOptions,
      password: {
        describe: "Password to validate",
        type: "string",
        demandOption: true,
      },
    },
    handler: handleValidateCommand,
  })
  .command({
    command: "generate",
    describe: "Generate a password",
    builder: {
      ...commonOptions,
      minLength: {
        describe: "Minimum password length",
        type: "number",
      },
      maxLength: {
        describe: "Maximum password length",
        type: "number",
      },
      minDigits: {
        describe: "Minimum number of digits",
        type: "number",
      },
      minSpecials: {
        describe: "Minimum number of special characters",
        type: "number",
      },
      minUppercase: {
        describe: "Minimum number of uppercase characters",
        type: "number",
      },
      minLowercase: {
        describe: "Minimum number of lowercase characters",
        type: "number",
      },
      noRecurring: {
        describe: "Disallow recurring characters",
        type: "boolean",
      },
    },
    handler: handleGenerateCommand,
  })
  .demandCommand(1, "You must provide a valid command")
  .help().argv;
