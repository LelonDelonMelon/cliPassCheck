const yargs = require("yargs");
const colors = require("./colors"); // Assuming colors is correctly set up
const readCpc = require("./config/configReader"); // Adjust the path as needed
const validators = require("./validators");

/**
 * Validate if the input password meets the criteria
 * @param {string} input - The password to check
 * @param {number} minLength - The minimum length of the password
 * @param {number} minDigits - The minimum number of digits in the password
 * @param {number} minSpecials - The minimum number of special characters in the password
 * @returns {boolean} - True if the password is valid, false otherwise
 * @returns {boolean} - True if the password is valid, false otherwise
 */
function validateInput(input, minLength, minDigits, minSpecials, maxLength) {
    const problemList = [];
    if (validators.minimumDigitsHandler(input, minDigits)) {
        problemList.push(
            `\nPassword should have at least ${minDigits} digits.\n`
        );
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
        problemList.push(
            `Password should not have any recurring characters.\n`
        );
    }

    if (validators.maximumLengthHandler(input, maxLength)) {
        problemList.push(
            `Password should not exceed ${maxLength} characters.\n`
        );
    }

    if (validators.minimumLengthHandler(input, minLength)) {
        problemList.push(
            `Password should be at least ${minLength} characters.\n`
        );
    }

    return problemList;
}

/**
 * Handle the `check` command
 * @param {object} argv - The parsed arguments
 */
function handleCheckCommand(argv) {
    let minLength, minDigits, minSpecials, maxLength, password;

    if (argv.config) {
        console.log(`Reading config from: ${argv.config}`);
        const config = readCpc(argv.config);
        minLength = parseInt(config.minLength, 10);
        minDigits = parseInt(config.minDigits, 10);
        minSpecials = parseInt(config.minSpecials, 10);
        maxLength = parseInt(config.maxLength, 10);
        password = argv.password;
    } else {
        minLength = argv.minLength;
        minDigits = argv.minDigits;
        minSpecials = argv.minSpecials;
        maxLength = argv.maxLength;
        password = argv.password;
    }

    if (!password) {
        console.error(
            `${colors.Fg.Red}The --password argument is required.${colors.Reset}`
        );
        process.exit(1);
    }

    const res = validateInput(
        password,
        minLength,
        minDigits,
        minSpecials,
        maxLength
    );


    if (res.length === 0) console.log(`${colors.Fg.Green}Password is valid${colors.Reset}`);

    else {

        console.log(`${colors.Bg.Red}Password is invalid. Check the following requirements:${colors.Reset}`);
        console.log(`${colors.Fg.Red}\n${res.join("")}${colors.Reset}`);
    }
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
