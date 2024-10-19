const yargs = require('yargs');
const colors = require('./colors');

function validateInput(input, minlength, minDigits, minSpecials) {
    if (input.length < minlength) {
        console.log(`${colors.Fg.Red}Password is too short. Minimum length required is ${minlength}.${colors.Reset}`);
        return false;
    }

    let digitCount = 0, specialCharCount = 0, upperCaseCount = 0;

    for (let char of input) {
        if (/\d/.test(char)) digitCount++;
        if (/\W|_/.test(char)) specialCharCount++;
    }

    if (digitCount < minDigits) {
        console.log(`${colors.Fg.Red}Password should contain at least ${minDigits} digits.${colors.Reset}`);
        return false;
    }

    if (specialCharCount < minSpecials) {
        console.log(`${colors.Fg.Red}Password should contain at least ${minSpecials} special characters.${colors.Reset}`);
        return false;
    }

    return true;
}

// Function to handle the `check` command
function handleCheckCommand(argv) {
    const { minlength, minDigits, password, minSpecials } = argv;

    if (!password) {
        console.error(`${colors.Fg.Red}The --password argument is required.${colors.Reset}`);
        process.exit(1);
    }

    const res = validateInput(password, minlength, minDigits, minSpecials);
    if (res)
        console.log(`${colors.Fg.Green}Password is valid${colors.Reset}`);
}

// Configure yargs to handle the `check` command
yargs.command({
    command: 'check',
    describe: 'Check if the input password meets the criteria',
    builder: {
        minlength: {
            describe: 'Minimum length of the password',
            demandOption: true,
            type: 'number'
        },
        minDigits: {
            describe: 'Minimum number of digits in the password',
            demandOption: true,
            type: 'number'
        },
        minSpecials: {
            describe: 'Minimum number of special characters in the password',
            demandOption: true,
            type: 'number'
        },
        password: {
            describe: 'Password to check',
            demandOption: true,
            type: 'string'
        }
    },
    handler: handleCheckCommand
})
    .help()
    .argv;

