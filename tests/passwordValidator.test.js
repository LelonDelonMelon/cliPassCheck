const validateInput = require('../validators/passwordValidator');

describe('Password Validator', () => {
    test('should validate a password with recurring characters when noRecurring is false', () => {
        const password = 'peniSSSS1_';
        const errors = validateInput(password, 8, 1, 1, 32, 1, 1, false);
        expect(errors).toHaveLength(0);
    });

    test('should invalidate a password with recurring characters when noRecurring is true', () => {
        const password = 'peniSSSS1_';
        const errors = validateInput(password, 8, 1, 1, 32, 1, 1, true);
        expect(errors).toHaveLength(1);
        expect(errors[0]).toContain('must not contain recurring characters');
    });

    test('should validate a password without recurring characters', () => {
        const password = 'peniS123_';
        const errors = validateInput(password, 8, 1, 1, 32, 1, 1, true);
        expect(errors).toHaveLength(0);
    });

    // Add more test cases for other validation rules
    test('should validate minimum length', () => {
        const password = 'aA1!';  // Meets all criteria except length
        const errors = validateInput(password, 8, 1, 1, 32, 1, 1, false);
        expect(errors).toHaveLength(1);
        expect(errors[0]).toContain('must be at least 8 characters');
    });

    test('should validate maximum length', () => {
        const password = 'thisIsAReallyLongPasswordThatExceedsTheMaximumLength123!';
        const errors = validateInput(password, 8, 1, 1, 32, 1, 1, false);
        expect(errors).toHaveLength(1);
        expect(errors[0]).toContain('must be at most 32 characters');
    });

    test('should validate minimum digits', () => {
        const password = 'noDigitsHere!A';  // Meets all criteria except digits
        const errors = validateInput(password, 8, 1, 1, 32, 1, 1, false);
        expect(errors).toHaveLength(1);
        expect(errors[0]).toContain('must contain at least 1 digit');
    });

    test('should validate minimum special characters', () => {
        const password = 'noSpecialChars123A';  // Meets all criteria except special chars
        const errors = validateInput(password, 8, 1, 1, 32, 1, 1, false);
        expect(errors).toHaveLength(1);
        expect(errors[0]).toContain('must contain at least 1 special character');
    });

    test('should validate minimum uppercase letters', () => {
        const password = 'nouppercase123!';  // Meets all criteria except uppercase
        const errors = validateInput(password, 8, 1, 1, 32, 1, 1, false);
        expect(errors).toHaveLength(1);
        expect(errors[0]).toContain('must contain at least 1 uppercase letter');
    });

    test('should validate minimum lowercase letters', () => {
        const password = 'NOLOWERCASE123!';  // Meets all criteria except lowercase
        const errors = validateInput(password, 8, 1, 1, 32, 1, 1, false);
        expect(errors).toHaveLength(1);
        expect(errors[0]).toContain('must contain at least 1 lowercase letter');
    });

    test('should validate multiple criteria at once', () => {
        const password = 'bad';  // Too short, no digits, no specials, no uppercase
        const errors = validateInput(password, 8, 1, 1, 32, 1, 1, false);
        expect(errors.length).toBeGreaterThan(1);
    });
});
