const crypto = require('crypto');

function secureRandomChoice(arr) {
    const idx = crypto.randomInt(0, arr.length);
    return arr[idx];
}

function generatePassword(minLength, minDigits, minSpecials, minUppercase, minLowercase, maxLength) {
    const digits = '0123456789';
    const specials = '!@#$%^&*()_+[]{}|;:,.<>?';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let password = [];

    // Add required characters for each type
    for (let i = 0; i < minDigits; i++) {
        password.push(secureRandomChoice(digits));
        console.log("pushed digits")
    }
    for (let i = 0; i < minSpecials; i++) {
        password.push(secureRandomChoice(specials));

        console.log("pushed specials")

    }
    for (let i = 0; i < minUppercase; i++) {
        password.push(secureRandomChoice(uppercase));

        console.log("pushed uppercase")

    }
    for (let i = 0; i < minLowercase; i++) {
        password.push(secureRandomChoice(lowercase));

        console.log("pushed lowercase")

    }

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

