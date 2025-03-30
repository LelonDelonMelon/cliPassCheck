const readCpc = require("../config/configReader");
const fs = require("fs").promises;
const path = require("path");

describe("readCpc", () => {
  const testFilePath = path.join(__dirname, "test.cpc");
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset process.env before each test
    process.env = { ...originalEnv };
  });

  afterEach(async () => {
    try {
      await fs.unlink(testFilePath);
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
  });

  afterAll(() => {
    // Restore original process.env
    process.env = originalEnv;
  });

  it("should read and parse a valid .cpc file", async () => {
    await fs.writeFile(
      testFilePath,
      `# This is a comment
KEY1=value1
KEY2=value2

KEY3=value3`
    );

    const config = await readCpc(testFilePath);
    expect(config).toEqual({
      KEY1: "value1",
      KEY2: "value2",
      KEY3: "value3",
    });
  });

  it("should throw TypeError for invalid file paths", async () => {
    await expect(readCpc(123)).rejects.toThrow(TypeError);
    await expect(readCpc(null)).rejects.toThrow(TypeError);
  });

  it("should throw error for invalid file extensions", async () => {
    await expect(readCpc("invalid.txt")).rejects.toThrow(
      "Invalid config file extension"
    );
  });

  it("should throw error when file does not exist", async () => {
    await expect(readCpc("nonexistent.cpc")).rejects.toThrow(
      "Config file not found"
    );
  });

  it("should handle empty lines and comments", async () => {
    await fs.writeFile(
      testFilePath,
      `
# Comment 1
KEY1=value1

# Comment 2

KEY2=value2
`
    );

    const config = await readCpc(testFilePath);
    expect(config).toEqual({
      KEY1: "value1",
      KEY2: "value2",
    });
  });

  it("should throw error for malformed lines", async () => {
    await fs.writeFile(testFilePath, "invalid_line_without_equals");
    await expect(readCpc(testFilePath)).rejects.toThrow("Invalid config line format");
  });

  it("should throw error for missing key or value", async () => {
    await fs.writeFile(testFilePath, "KEY1=\n=value2");
    await expect(readCpc(testFilePath)).rejects.toThrow("Missing key or value");
  });

  it("should support environment variable substitution", async () => {
    process.env.TEST_ENV = "test_value";
    await fs.writeFile(testFilePath, "KEY1=\${TEST_ENV}");

    const config = await readCpc(testFilePath);
    expect(config).toEqual({
      KEY1: "test_value",
    });
  });

  it("should throw error for undefined environment variables", async () => {
    await fs.writeFile(testFilePath, "KEY1=\${UNDEFINED_ENV}");
    await expect(readCpc(testFilePath)).rejects.toThrow(
      "Environment variable not found: UNDEFINED_ENV"
    );
  });

  it("should support custom value validation", async () => {
    await fs.writeFile(testFilePath, "NUMBER=123\nSTRING=abc");

    const validateValue = (key, value) => {
      if (key === "NUMBER" && !/^\d+$/.test(value)) {
        throw new Error("must be a number");
      }
      if (key === "STRING" && /\d/.test(value)) {
        throw new Error("must not contain numbers");
      }
    };

    const config = await readCpc(testFilePath, { validateValue });
    expect(config).toEqual({
      NUMBER: "123",
      STRING: "abc",
    });

    // Should fail validation
    await fs.writeFile(testFilePath, "NUMBER=abc");
    await expect(readCpc(testFilePath, { validateValue })).rejects.toThrow(
      "Invalid config value for NUMBER: must be a number"
    );
  });

  it("should retry on transient errors", async () => {
    const mockReadFile = jest
      .spyOn(fs, "readFile")
      .mockRejectedValueOnce(new Error("Transient error"))
      .mockResolvedValueOnce("KEY=value");

    const config = await readCpc(testFilePath);
    expect(config).toEqual({ KEY: "value" });
    expect(mockReadFile).toHaveBeenCalledTimes(2);

    mockReadFile.mockRestore();
  });
});
