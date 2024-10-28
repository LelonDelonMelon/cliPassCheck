const fs = require("fs");
const path = require("path");

/**
 * Reads the config file with .cpc extension
 * @param {string} filePath - The path to the config file
 * @returns {object} - The parsed config object
 */
function readCpc(filePath) {
  if (typeof filePath !== "string") {
    throw new Error('The "path" argument must be of type string');
  }

  const extension = path.extname(filePath);
  if (extension !== ".cpc") {
    throw new Error("Invalid config file extension. Expecting a .cpc file");
  }

  try {
    const contents = fs.readFileSync(filePath, "utf-8");
    const config = {};

    contents.split("\n").forEach((line) => {
      line = line.trim();
      if (line && !line.startsWith("#")) {
        const [key, value] = line.split("=");
        if (key && value) {
          config[key.trim()] = value.trim();
        }
      }
    });

    return config;
  } catch (e) {
    console.error("Error reading config file:", e.message);
    throw e;
  }
}

module.exports = readCpc;
