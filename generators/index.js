const crypto = require('crypto');

function secureRandomChoice(arr) {
    const idx = crypto.randomInt(0, arr.length);
    return arr[idx];
}
function secureRandomIndex() {
    const idx = crypto.randomInt(0, 4);
    return idx;
}


function fixBoundaries(password, digits, specials, uppercase, lowercase, flag) {

    if (flag !== 1) {
        const rand = crypto.randomInt(1, 4);
        if (rand === 1) password.push(secureRandomChoice(digits))
        if (rand === 2) password.push(secureRandomChoice(specials))
        if (rand === 3) password.push(secureRandomChoice(uppercase))
        if (rand === 4) password.push(secureRandomChoice(lowercase))

    } else {
        const rand = crypto.randomInt(1, 4);
        if (rand === 1) password.pop(secureRandomChoice(digits))
        if (rand === 2) password.push(secureRandomChoice(specials))
        if (rand === 3) password.push(secureRandomChoice(uppercase))
        if (rand === 4) password.push(secureRandomChoice(lowercase))

    }
}
function generatePassword(minLength, minDigits, minSpecials, minUppercase, minLowercase, maxLength) {
    const digits = '0123456789';
    const specials = '!@#$%^&*()_+[]{}|;:,.<>?';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let curLength, curDigits, curSpecials, curLowerCase, curUpperCase;
    let password = [];

    // Add required characters for each type
    for (let i = curLength; i < minLength; curLength++) {
        for (let i = curDigits; i < minDigits; curDigits) {
            password.push(secureRandomChoice(digits));
            console.log("pushed digits")
        }
        for (let i = curSpecials; i < minSpecials; curSpecials++) {
            password.push(secureRandomChoice(specials));

            console.log("pushed specials")

        }
        for (let i = curUpperCase; i < minUppercase; curUpperCase++) {
            password.push(secureRandomChoice(uppercase));

            console.log("pushed uppercase")

        }
        for (let i = curLowerCase; i < minLowercase; curLowerCase++) {
            password.push(secureRandomChoice(lowercase));

            console.log("pushed lowercase")
        }

        fixBoundaries(password, digits, specials, uppercase, lowercase, 0);
    };
    if (curLength >= maxLength)
        fixBoundaries(password, digits, specials, uppercase, lowercase, 1)
    // Fill remaining length with random characters up to minLength or maxLength
    const allCharacters = digits + specials + lowercase + uppercase;
    while (password.length < minLength) {
        password.push(secureRandomChoice(allCharacters));
    }

    // If the password exceeds maxLength, trim it
    if (password.length > maxLength) {
        password = password.slice(0, maxLength);
    }

    // Shuffle the password to make it random
    for (let i = password.length - 1; i > 0; i--) {
        const j = crypto.randomInt(0, i + 1);
        [password[i], password[j]] = [password[j], password[i]]; // Swap elements
    }

    // Join the array into a single string and return
    return password.join('');
}

module.exports = generatePassword;

