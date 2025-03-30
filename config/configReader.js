const fs = require("fs").promises;
const path = require("path");

/**
 * Reads and parses a .cpc config file
 * @param {string} filePath - The path to the config file
 * @param {object} options - Configuration options
 * @param {number} options.retries - Number of retries for transient errors (default: 3)
 * @param {function} options.validateValue - Custom validation function for config values
 * @returns {Promise<object>} - The parsed config object
 * @throws {Error} - If the file is invalid or cannot be read
 */
async function readCpc(filePath, options = {}) {
  const { retries = 3, validateValue } = options;

  if (typeof filePath !== "string") {
    throw new TypeError('The "path" argument must be of type string');
  }

  const extension = path.extname(filePath);
  if (extension !== ".cpc") {
    throw new Error("Invalid config file extension. Expecting a .cpc file");
  }

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const contents = await fs.readFile(filePath, "utf-8");
      return parseConfig(contents, validateValue);
    } catch (error) {
      if (error.code === "ENOENT") {
        throw new Error(`Config file not found: ${filePath}`);
      }
      
      const isLastAttempt = attempt === retries - 1;
      if (isLastAttempt || error.name === "ConfigValidationError") {
        throw error;
      }
      
      // Wait before retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
    }
  }
}

/**
 * Parses the config file contents
 * @private
 */
function parseConfig(contents, validateValue) {
  const config = {};
  
  const lines = contents.split("\n");
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines and comments
    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }
    
    const separatorIndex = trimmedLine.indexOf("=");
    if (separatorIndex === -1) {
      throw new Error(`Invalid config line format: ${line}`);
    }
    
    const key = trimmedLine.slice(0, separatorIndex).trim();
    const value = trimmedLine.slice(separatorIndex + 1).trim();
    
    if (!key || !value) {
      throw new Error(`Missing key or value in line: ${line}`);
    }
    
    const parsedValue = replaceEnvVars(value);
    
    if (validateValue) {
      try {
        validateValue(key, parsedValue);
      } catch (error) {
        const validationError = new Error(`Invalid config value for ${key}: ${error.message}`);
        validationError.name = "ConfigValidationError";
        throw validationError;
      }
    }
    
    config[key] = parsedValue;
  }
  
  return config;
}

/**
 * Replaces environment variables in the value
 * @private
 */
function replaceEnvVars(value) {
  return value.replace(/\$\{(.*?)\}/g, (match, varName) => {
    const envValue = process.env[varName];
    if (typeof envValue === "undefined") {
      throw new Error(`Environment variable not found: ${varName}`);
    }
    return envValue;
  });
}

module.exports = readCpc;
