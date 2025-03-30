const {
  maximumLengthHandler,
  minimumLengthHandler,
  minimumDigitsHandler,
  minimumSpecialsHandler,
  minimumUppercaseHandler,
  minimumLowercaseHandler,
  recurringCharacterHandler,
} = require("../validators");

describe("Password Validators", () => {
  describe("maximumLengthHandler", () => {
    it("should return true when password exceeds maximum length", () => {
      expect(maximumLengthHandler("password123", 8)).toBe(true);
    });

    it("should return false when password is equal to maximum length", () => {
      expect(maximumLengthHandler("pass1234", 8)).toBe(false);
    });

    it("should return false when password is less than maximum length", () => {
      expect(maximumLengthHandler("pass", 8)).toBe(false);
    });
  });

  describe("minimumLengthHandler", () => {
    it("should return true when password is shorter than minimum length", () => {
      expect(minimumLengthHandler("pass", 8)).toBe(true);
    });

    it("should return false when password is equal to minimum length", () => {
      expect(minimumLengthHandler("password1", 8)).toBe(false);
    });

    it("should return false when password is longer than minimum length", () => {
      expect(minimumLengthHandler("password123", 8)).toBe(false);
    });
  });

  describe("minimumDigitsHandler", () => {
    it("should return true when password has fewer digits than required", () => {
      expect(minimumDigitsHandler("password1", 2)).toBe(true);
    });

    it("should return false when password has exactly the required digits", () => {
      expect(minimumDigitsHandler("password12", 2)).toBe(false);
    });

    it("should return false when password has more digits than required", () => {
      expect(minimumDigitsHandler("password123", 2)).toBe(false);
    });

    it("should return true when password has no digits and minimum is required", () => {
      expect(minimumDigitsHandler("password", 1)).toBe(true);
    });
  });

  describe("minimumSpecialsHandler", () => {
    it("should return true when password has fewer special characters than required", () => {
      expect(minimumSpecialsHandler("password!", 2)).toBe(true);
    });

    it("should return false when password has exactly the required special characters", () => {
      expect(minimumSpecialsHandler("password!@", 2)).toBe(false);
    });

    it("should return false when password has more special characters than required", () => {
      expect(minimumSpecialsHandler("password!@#", 2)).toBe(false);
    });

    it("should count underscore as a special character", () => {
      expect(minimumSpecialsHandler("password_!", 2)).toBe(false);
    });

    it("should return true when password has no special characters and minimum is required", () => {
      expect(minimumSpecialsHandler("password", 1)).toBe(true);
    });
  });

  describe("minimumUppercaseHandler", () => {
    it("should return true when password has fewer uppercase letters than required", () => {
      expect(minimumUppercaseHandler("password", 1)).toBe(true);
    });

    it("should return false when password has exactly the required uppercase letters", () => {
      expect(minimumUppercaseHandler("Password", 1)).toBe(false);
    });

    it("should return false when password has more uppercase letters than required", () => {
      expect(minimumUppercaseHandler("PassWord", 1)).toBe(false);
    });

    it("should not count numbers or special characters as uppercase", () => {
      expect(minimumUppercaseHandler("password123!@#", 1)).toBe(true);
    });
  });

  describe("minimumLowercaseHandler", () => {
    it("should return true when password has fewer lowercase letters than required", () => {
      expect(minimumLowercaseHandler("PASSWORD", 1)).toBe(true);
    });

    it("should return false when password has exactly the required lowercase letters", () => {
      expect(minimumLowercaseHandler("PASSWORd", 1)).toBe(false);
    });

    it("should return false when password has more lowercase letters than required", () => {
      expect(minimumLowercaseHandler("PassWord", 1)).toBe(false);
    });

    it("should not count numbers or special characters as lowercase", () => {
      expect(minimumLowercaseHandler("PASSWORD123!@#", 1)).toBe(true);
    });
  });

  describe("recurringCharacterHandler", () => {
    it("should return true when password has recurring characters", () => {
      expect(recurringCharacterHandler("passsword")).toBe(true); // 's' appears twice
    });

    it("should return true when password has recurring numbers", () => {
      expect(recurringCharacterHandler("pass11word")).toBe(true);
    });

    it("should return true when password has recurring special characters", () => {
      expect(recurringCharacterHandler("pass!!word")).toBe(true);
    });

    it("should return false when password has no recurring characters", () => {
      expect(recurringCharacterHandler("Pasw0rd!")).toBe(false);
    });

    it("should be case sensitive in matching recurring characters", () => {
      expect(recurringCharacterHandler("PassworD")).toBe(true); // 's' appears twice
    });
  });
});
