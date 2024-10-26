# Password Checker CLI

A Node.js command-line application to validate passwords based on configurable criteria. This tool allows checking if a password meets certain security requirements, such as minimum length, number of digits, and number of special characters. You can specify these criteria directly via command-line arguments or through a configuration file with a `.cpc` extension.

![Password Checker CLI Demo](./assets/cpcdemo.gif)

## Features

- Validate password length, digit count, and special character count.
- Support for configuration files with `.cpc` extension.
- Colored output for better readability.

## Currently Supported Validation Criterias

- Minimum length (`--minlength`).
- Minimum number of digits (`--minDigits`).
- Minimum number of special characters (`--minSpecials`).
- Recurring character check (by default)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/LelonDelonMelon/cliPassCheck.git
   cd cliPassCheck
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

## Usage

You can pass the password criteria directly as CLI arguments:

```sh
node index.js check --password "yourpassword" --minlength 8 --minDigits 2 --minSpecials 1
```

## Configuration File

Alternatively, you can use a configuration file to specify the validation criteria:

1. Create a `.cpc` configuration file with the following format:

   ```
   minlength = 8
   minDigits = 2
   minSpecials = 1
   ```

2. Run the command with the `--config` argument, passing the path to your `.cpc` file:

   ```sh
   node index.js check --password "yourpassword" --config "./path/to/config.cpc"
   ```

   - The default configuration file is at `./config/example.cpc`

## Configuration File Format

The configuration file should have a `.cpc` extension and contain key-value pairs for the criteria. For example:

```
# example.cpc
minlength = 8
minDigits = 2
minSpecials = 1
```

## Example

Running with Command-Line Arguments

```sh
node index.js check --password "deneme123" --minlength 8 --minDigits 2 --minSpecials 1
```

Running with a Configuration File

1. Create a config file called config.cpc

```
#config.cpc
minlength = 8
minDigits = 2
minSpecials = 1
```

2. Run the following command:

```sh
node index.js check --password "pass123" --config "./config.cpc"
```

## Dependencies

This package requires:

- nodejs: ^20.x.x
- npm: ^10.x.x
- yargs: ^17.7.2
