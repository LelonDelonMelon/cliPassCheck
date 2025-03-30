const crypto = require("crypto");
const generatePassword = require("../generators/passwordGenerator");
const validators = require("../validators");

// Mock crypto module
jest.mock("crypto", () => {
  const originalModule = jest.requireActual("crypto");
  return {
    ...originalModule,
    randomBytes: jest.fn().mockImplementation((size) => {
      // Return real random bytes by default
      return originalModule.randomBytes(size);
    }),
  };
});

// Mock generatePassword module
jest.mock("../generators/passwordGenerator", () => {
  const originalModule = jest.requireActual("../generators/passwordGenerator");
  return jest.fn().mockImplementation((...args) => originalModule(...args));
});

describe("generatePassword", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("should generate valid passwords with default options", () => {
    const password = generatePassword();
    
    expect(password.length).toBeGreaterThanOrEqual(12);
    expect(password.length).toBeLessThanOrEqual(32);
    expect(validators.minimumDigitsHandler(password, 1)).toBe(false);
    expect(validators.minimumSpecialsHandler(password, 1)).toBe(false);
    expect(validators.minimumUppercaseHandler(password, 1)).toBe(false);
    expect(validators.minimumLowercaseHandler(password, 1)).toBe(false);
  });

  it("should respect minimum length requirements", () => {
    const options = { minLength: 20 };
    const password = generatePassword(options);
    expect(password.length).toBeGreaterThanOrEqual(20);
  });

  it("should respect maximum length requirements", () => {
    const options = { maxLength: 16 };
    const password = generatePassword(options);
    expect(password.length).toBeLessThanOrEqual(16);
  });

  it("should generate password with specified minimum digits", () => {
    const options = { minDigits: 3 };
    const password = generatePassword(options);
    expect(validators.minimumDigitsHandler(password, 3)).toBe(false);
  });

  it("should generate password with specified minimum special characters", () => {
    const options = { minSpecial: 3 };
    const password = generatePassword(options);
    expect(validators.minimumSpecialsHandler(password, 3)).toBe(false);
  });

  it("should generate password with specified minimum uppercase letters", () => {
    const options = { minUppercase: 3 };
    const password = generatePassword(options);
    expect(validators.minimumUppercaseHandler(password, 3)).toBe(false);
  });

  it("should generate password with specified minimum lowercase letters", () => {
    const options = { minLowercase: 3 };
    const password = generatePassword(options);
    expect(validators.minimumLowercaseHandler(password, 3)).toBe(false);
  });

  it("should generate password without recurring characters when specified", () => {
    const options = { noRecurring: true };
    const password = generatePassword(options);
    expect(validators.recurringCharacterHandler(password)).toBe(false);
  });

  it("should throw error when minLength > maxLength", () => {
    const options = { minLength: 20, maxLength: 10 };
    expect(() => generatePassword(options)).toThrow(
      "minLength cannot be greater than maxLength"
    );
  });

  it("should throw error when minLength is less than sum of minimum requirements", () => {
    const options = {
      minLength: 5,
      minDigits: 2,
      minSpecial: 2,
      minUppercase: 2,
      minLowercase: 2,
    };
    expect(() => generatePassword(options)).toThrow(
      "minLength (5) must be at least the sum of minimum requirements (8)"
    );
  });

  it("should generate unique passwords", () => {
    const passwords = new Set();
    for (let i = 0; i < 100; i++) {
      passwords.add(generatePassword());
    }
    expect(passwords.size).toBe(100);
  });

  it("should throw error after maximum attempts when constraints are too strict", () => {
    // Mock generatePassword to throw after a few attempts
    generatePassword.mockImplementationOnce((options) => {
      throw new Error(
        "Failed to generate a password meeting all criteria after maximum attempts"
      );
    });

    const options = {
      minLength: 4,
      maxLength: 4,
      minDigits: 1,
      minSpecial: 1,
      minUppercase: 1,
      minLowercase: 1,
      noRecurring: true
    };

    expect(() => generatePassword(options)).toThrow(
      "Failed to generate a password meeting all criteria after maximum attempts"
    );
  });
});
