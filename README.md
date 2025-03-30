# Password Checker CLI

A Node.js command-line application for password validation and generation. This tool allows you to generate secure passwords and validate them against configurable criteria, such as minimum length, number of digits, and special characters. You can specify these criteria directly via command-line arguments or through a configuration file with a `.cpc` extension.

![Password Checker CLI Demo](./assets/cpcdemo.gif)

## Features

- Generate cryptographically secure passwords
- Validate passwords against customizable criteria
- Support for configuration files with `.cpc` extension
- Colored output for better readability

## Validation Criteria

- Minimum length (`--minLength`)
- Maximum length (`--maxLength`)
- Minimum number of digits (`--minDigits`)
- Minimum number of special characters (`--minSpecials`)
- Minimum number of uppercase letters (`--minUppercase`)
- Minimum number of lowercase letters (`--minLowercase`)
- Option to disallow recurring characters (`--noRecurring`)

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

The CLI provides two main commands: `generate` and `validate`.

### Generating Passwords

Generate a password using command-line arguments:

```sh
node index.js generate --minLength 12 --minDigits 2 --minSpecials 2 --minUppercase 1 --minLowercase 1
```

Generate a password using a configuration file:

```sh
node index.js generate --config "./config/example.cpc"
```

### Validating Passwords

Validate a password using command-line arguments:

```sh
node index.js validate --password "YourPassword123!" --minLength 8 --minDigits 2 --minSpecials 1
```

Validate a password using a configuration file:

```sh
node index.js validate --password "YourPassword123!" --config "./config/example.cpc"
```

## Configuration File Format

The configuration file should have a `.cpc` extension and contain key-value pairs for the criteria. For example:

```ini
# example.cpc
minLength = 8
maxLength = 32
minDigits = 2
minSpecials = 1
minUppercase = 1
minLowercase = 1
```

Comments start with `#` and are ignored.

## Command Options

### Common Options (Available for both commands)

- `--config`: Path to the configuration file (optional)
- `--minLength`: Minimum password length (default: 8)
- `--maxLength`: Maximum password length (default: 32)
- `--minDigits`: Minimum number of digits (default: 1)
- `--minSpecials`: Minimum number of special characters (default: 1)

### Generate Command Options

- `--minUppercase`: Minimum number of uppercase letters (default: 1)
- `--minLowercase`: Minimum number of lowercase letters (default: 1)
- `--noRecurring`: Disallow recurring characters (default: false)

### Validate Command Options

- `--password`: The password to validate (required)

## Examples

1. Generate a strong password:

```sh
node index.js generate --minLength 16 --minDigits 3 --minSpecials 2 --noRecurring
```

2. Generate a password using default settings:

```sh
node index.js generate
```

3. Validate a password with custom requirements:

```sh
node index.js validate --password "MyStr0ng\!Pass" --minLength 12 --minDigits 2
```

4. Using a configuration file:

```sh
# First, create a config file:
echo "minLength = 12
minDigits = 2
minSpecials = 2
minUppercase = 1
minLowercase = 1" > config.cpc

# Then use it for generation or validation:
node index.js generate --config "./config.cpc"
node index.js validate --password "YourPassword123!" --config "./config.cpc"
```

## Getting Help

To see all available commands and options:

```sh
node index.js --help
```

To see options for a specific command:

```sh
node index.js generate --help
node index.js validate --help
```

## Dependencies

- Node.js (v12 or higher)
- yargs: Command-line argument parsing
- crypto: Cryptographically secure random number generation
