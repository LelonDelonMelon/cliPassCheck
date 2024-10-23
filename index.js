const yargs = require('yargs')
const colors = require('./colors')
/**
 * Validate if the input password meets the criteria
 * @param {string} input - The password to check
 * @param {number} minlength - The minimum length of the password
 * @param {number} minDigits - The minimum number of digits in the password
 * @param {number} minSpecials - The minimum number of special characters in the password
 * @returns {boolean} - True if the password is valid, false otherwise
 */
function validateInput(input, minlength, minDigits, minSpecials) {
    if (input.length < minlength) {
        console.log(
            `${colors.Fg.Red}Password is too short. Minimum length required is ${minlength}.${colors.Reset}`
        );
        return false;
    }

    let digitCount = 0,
        specialCharCount = 0,
        upperCaseCount = 0;

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
    if (!checkReccurringChars(input)) {
        errorList.push('should not contain recurring characters')
        return false;
    }
    return true;
}
let errorList = [];

function checkReccurringChars(input) {
    if (typeof input !== 'string')
        return false;
    for (let i = 1; i < input.length; i++) {
        for (let j = i - 1; j < input.length; j++) {
            if (input.charAt(i) === input.charAt(j)) {

                console.log(
                    `${colors.Fg.Red}Password should not contain recurring characters. Found ${input.charAt(i)} and ${input.charAt(j)} ${colors.Reset}`
                );

                return false;
            }
        };
    };
    console.log('valid');
    return true;
}

/**
 * Handle the `check` command
 * @param {object} argv - The parsed arguments
 */
function handleCheckCommand(argv) {
    const { minlength, minDigits, password, minSpecials } = argv;

    if (!password) {
        console.error(
            `${colors.Fg.Red}The --password argument is required.${colors.Reset}`
        );
        process.exit(1);
    }

    const res = validateInput(password, minlength, minDigits, minSpecials);
    if (res) console.log(`${colors.Fg.Green}Password is valid${colors.Reset}`);
}

yargs
    .command({
        command: "check",
        describe: "Check if the input password meets the criteria",
        builder: {
            minlength: {
                describe: "Minimum length of the password",
                demandOption: true,
                type: "number",
            },
            minDigits: {
                describe: "Minimum number of digits in the password",
                demandOption: true,
                type: "number",
            },
            minSpecials: {
                describe: "Minimum number of special characters in the password",
                demandOption: true,
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
