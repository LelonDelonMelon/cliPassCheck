const yargs = require("yargs");
const colors = require("./colors");
const readCpc = require("./config/configReader");
const generatePassword = require("./generators/passwordGenerator");
const validateInput = require("./validators/passwordValidator");

/**
 * Get configuration from either config file or command line arguments
 */
function getConfig(argv) {
    if (argv.config) {
        console.log(`Reading config from: ${argv.config}`);
        const config = readCpc(argv.config);
        return {
            minLength: parseInt(config.minLength, 10) || 8,
            minDigits: parseInt(config.minDigits, 10) || 1,
            minSpecial: parseInt(config.minSpecials, 10) || 1, 
            maxLength: parseInt(config.maxLength, 10) || 32,
            minUppercase: parseInt(config.minUppercase, 10) || 1,
            minLowercase: parseInt(config.minLowercase, 10) || 1,
            noRecurring: config.noRecurring === "true" 
        };
    }
    
    return {
        minLength: argv.minLength || 8,
        minDigits: argv.minDigits || 1,
        minSpecial: argv.minSpecials || 1, 
        maxLength: argv.maxLength || 32,
        minUppercase: argv.minUppercase || 1,
        minLowercase: argv.minLowercase || 1,
        noRecurring: argv.noRecurring || false
    };
}

/**
 * Handle the `validate` command
 */
function handleValidateCommand(argv) {
    const { minLength, minDigits, minSpecial, maxLength, minUppercase, minLowercase } = getConfig(argv);

    const password = argv.password;
    if (!password) {
        console.error(
            `${colors.Fg.Red}The --password argument is required for validation.${colors.Reset}`
        );
        process.exit(1);
    }

    try {
        const res = validateInput(
            password,
            minLength,
            minDigits,
            minSpecial,
            maxLength,
            minUppercase,
            minLowercase
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
        console.error(`${colors.Fg.Red}Error occurred: ${e.message}${colors.Reset}`);
        process.exit(1);
    }
}

/**
 * Handle the `generate` command
 */
function handleGenerateCommand(argv) {
    const config = getConfig(argv);

    try {
        const generatedPassword = generatePassword(config);
        console.log(
            `${colors.Fg.Green}Generated Password: ${generatedPassword}${colors.Reset}`
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
        type: "string"
    },
    minLength: {
        describe: "Minimum length of the password",
        type: "number",
        default: 8
    },
    minDigits: {
        describe: "Minimum number of digits",
        type: "number",
        default: 1
    },
    minSpecials: {
        describe: "Minimum number of special characters",
        type: "number",
        default: 1
    },
    maxLength: {
        describe: "Maximum length of the password",
        type: "number",
        default: 32
    },
    minUppercase: {
        describe: "Minimum number of uppercase letters",
        type: "number",
        default: 1
    },
    minLowercase: {
        describe: "Minimum number of lowercase letters",
        type: "number",
        default: 1
    }
};

yargs
    .scriptName("cli-password-checker")
    .usage("$0 <command> [options]")
    .command({
        command: "validate",
        describe: "Validate a password against specified criteria",
        builder: {
            ...commonOptions,
            password: {
                describe: "Password to validate",
                type: "string",
                demandOption: true
            }
        },
        handler: handleValidateCommand
    })
    .command({
        command: "generate",
        describe: "Generate a password meeting specified criteria",
        builder: {
            ...commonOptions,
            noRecurring: {
                describe: "Disallow recurring characters",
                type: "boolean",
                default: false
            }
        },
        handler: handleGenerateCommand
    })
    .strict()
    .demandCommand(1, "You must provide a valid command")
    .fail(function (msg, err, yargs) {
        console.error(`${colors.Fg.Red}${msg || (err && err.message) || 'Unknown argument: invalid-command'}${colors.Reset}`);
        process.exit(1);
    })
    .help()
    .argv;
