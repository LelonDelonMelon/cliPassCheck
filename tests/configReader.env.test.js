const readCpc = require('../config/configReader');
const fs = require('fs').promises;
const path = require('path');

describe('Config Reader Environment Variables', () => {
    const testConfigPath = path.join(__dirname, '../config/test.env.cpc');
    
    beforeAll(async () => {
        // Create a temporary config file for testing
        const configContent = `
# Test config with env vars
testValue = \${TEST_ENV_VAR}
minLength = \${MIN_LENGTH}
        `;
        await fs.writeFile(testConfigPath, configContent);
    });

    afterAll(async () => {
        // Clean up the temporary config file
        await fs.unlink(testConfigPath);
    });

    beforeEach(() => {
        // Clear any existing env vars before each test
        delete process.env.TEST_ENV_VAR;
        delete process.env.MIN_LENGTH;
    });

    test('should successfully replace environment variables', async () => {
        // Set environment variables
        process.env.TEST_ENV_VAR = 'test_value';
        process.env.MIN_LENGTH = '16';

        const config = await readCpc(testConfigPath);
        
        expect(config.testValue).toBe('test_value');
        expect(config.minLength).toBe('16');
    });

    test('should throw error for missing environment variables', async () => {
        await expect(readCpc(testConfigPath))
            .rejects
            .toThrow('Environment variable not found: TEST_ENV_VAR');
    });

    test('should handle multiple environment variables in one line', async () => {
        // Create a config with multiple env vars in one line
        const complexConfigContent = 'complexValue = \${PREFIX}_\${SUFFIX}';
        await fs.writeFile(testConfigPath, complexConfigContent);

        process.env.PREFIX = 'hello';
        process.env.SUFFIX = 'world';

        const config = await readCpc(testConfigPath);
        expect(config.complexValue).toBe('hello_world');
    });
});
