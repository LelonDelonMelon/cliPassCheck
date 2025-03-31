const yargs = require("yargs");
const colors = require("./colors");
const readCpc = require("./config/configReader");
const generatePassword = require("./generators/passwordGenerator");
const validateInput = require("./validators/passwordValidator");

/**
 * Get configuration from config file
 */
async function getConfig(argv) {
  if (!argv.config) {
    console.error(
      `${colors.Fg.Red}The --config argument is required. Please provide a .cpc config file.${colors.Reset}`
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
    demandOption: true,
  },
};

// Configure CLI commands
yargs
  .command(
    "generate",
    "Generate a password",
    commonOptions,
    handleGenerateCommand
  )
  .command(
    "validate",
    "Validate a password",
    {
      ...commonOptions,
      password: {
        describe: "Password to validate",
        type: "string",
        demandOption: true,
      },
    },
    handleValidateCommand
  )
  .demandCommand(1, "You must provide a valid command")
  .help().argv;
