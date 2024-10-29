function maximumLengthHandler(pass, maxLength) {
    return pass.length > maxLength;
}

function minimumLengthHandler(pass, minLength) {
    return pass.length < minLength;
}

function minimumDigitsHandler(pass, minDigits) {
    let digitCount = 0;
    for (let char of pass) {
        if (/\d/.test(char)) digitCount++;
    }
    return digitCount < minDigits;
}

function minimumSpecialsHandler(pass, minSpecials) {
    let specialCharCount = 0;
    for (let char of pass) {
        if (/\W|_/.test(char)) specialCharCount++;
    }
    return specialCharCount < minSpecials;
}

function minimumUppercaseHandler(pass, minUppercase) {
    let uppercaseCount = 0;
    for (let char of pass) {
        if (char === char.toUpperCase() && char !== char.toLowerCase())
            uppercaseCount++;
    }
    return uppercaseCount < minUppercase;
}

function minimumLowercaseHandler(pass, minLowercase) {
    let lowercaseCount = 0;
    for (let char of pass) {
        if (char === char.toLowerCase() && char !== char.toUpperCase())
            lowercaseCount++;
    }
    return lowercaseCount < minLowercase;
}

function recurringCharacterHandler(pass) {
    return /(.).*\1/.test(pass);
}
module.exports = {
    maximumLengthHandler,
    minimumLengthHandler,
    minimumDigitsHandler,
    minimumSpecialsHandler,
    minimumUppercaseHandler,
    minimumLowercaseHandler,
    recurringCharacterHandler,
};
