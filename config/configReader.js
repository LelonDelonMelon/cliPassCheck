const fs = require("fs");
const path = require("path");
const yargs = require("yargs");

function readCpc(filePath) {
    const extension = path.extname(filePath)

    if (extension !== '.cpc')
        throw new Error('Invalid config file extension. Expecting a .cpc file')
    try {
        const contents = fs.readFileSync(filePath, 'utf-8');
        const config = {}
        
        contents.split('\n').forEach(line => {
            line = line.trim()
            //console.log("Line by line", line)
            if (line && !line.startsWith('#')) {
                const [key, value] = line.split('=')
                if (key && value) {
                    config[key.trim()] = value.trim()
                }
            }
        }
        )
        console.log(config)
        return config;
    } catch (e) {
        console.error(e);
    }
}

/**
 * Reads the config file with .cpc extension
 * @param {string} filePath - The path to the config file
 * @returns {object} - The parsed config object
 */
function readConfig(filePath) {
    const ext = path.extname(filePath);

    // Check if the file has a .cpc extension
    if (ext !== ".cpc") {
        throw new Error("Invalid config file extension. Expected a .cpc file.");
    }

    // Read and parse the config
    try {
        const config = JSON.parse(fs.readFileSync(filePath, "utf8"));
        return config;
    } catch (error) {
        throw new Error(`Failed to parse config file: ${error.message}`);
    }
}

const argv = yargs
    .usage("Usage: $0 --file [path to config file]")
    .demandOption(["file"]).argv;

try {
    //const config = readConfig(argv.file);
    const config = readCpc(argv.file);
    console.log("Config file read successfully:", config);
} catch (error) {
    console.error(error.message);
}
