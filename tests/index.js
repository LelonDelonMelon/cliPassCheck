const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

describe('CLI Password Checker Integration Tests', () => {
  const cliPath = path.resolve(__dirname, '../index.js');
  const testConfigPath = path.resolve(__dirname, 'integration-test.cpc');

  beforeEach(() => {
    // Create a test config file
    fs.writeFileSync(
      testConfigPath,
      `minLength = 12
minDigits = 2
minSpecials = 2
minUppercase = 1
minLowercase = 1
maxLength = 32
noRecurring = false`
    );
  });

  afterEach(() => {
    // Clean up test config file
    try {
      fs.unlinkSync(testConfigPath);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  });

  describe('Password Generation', () => {
    it('should generate a password with default settings', () => {
      const result = execSync(`node ${cliPath} generate`, { encoding: 'utf8' });
      expect(result).toMatch(/Generated Password: .+/);
      
      const password = result.match(/Generated Password: (.+)/)[1].trim();
      expect(password.length).toBeGreaterThanOrEqual(8);
      expect(password).toMatch(/[0-9]/); // At least one digit
      expect(password).toMatch(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/); // At least one special char
    });

    it('should generate a password with custom requirements', () => {
      const result = execSync(
        `node ${cliPath} generate --minLength 16 --minDigits 3 --minSpecials 2`,
        { encoding: 'utf8' }
      );
      const password = result.match(/Generated Password: (.+)/)[1].trim();
      
      expect(password.length).toBeGreaterThanOrEqual(16);
      expect((password.match(/[0-9]/g) || []).length).toBeGreaterThanOrEqual(3);
      expect((password.match(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/g) || []).length).toBeGreaterThanOrEqual(2);
    });

    it('should generate a password using config file', () => {
      const result = execSync(
        `node ${cliPath} generate --config "${testConfigPath}"`,
        { encoding: 'utf8' }
      );
      const password = result.match(/Generated Password: (.+)/)[1].trim();
      
      expect(password.length).toBeGreaterThanOrEqual(12);
      expect((password.match(/[0-9]/g) || []).length).toBeGreaterThanOrEqual(2);
      expect((password.match(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/g) || []).length).toBeGreaterThanOrEqual(2);
      expect((password.match(/[A-Z]/g) || []).length).toBeGreaterThanOrEqual(1);
      expect((password.match(/[a-z]/g) || []).length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Password Validation', () => {
    it('should validate a valid password', () => {
      const result = execSync(
        `node ${cliPath} validate --password "Test1@Pa2#Zk" --minLength 8 --minDigits 2 --minSpecials 2 --minUppercase 1 --minLowercase 1`,
        { encoding: 'utf8' }
      );
      expect(result).toContain('Password is valid');
    });

    it('should reject an invalid password', () => {
      try {
        execSync(
          `node ${cliPath} validate --password "weak" --minLength 8`,
          { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
        );
        throw new Error('Expected command to throw an error');
      } catch (error) {
        if (error.message === 'Expected command to throw an error') {
          throw error;
        }
        expect(error.status).not.toBe(0);
        expect(error.stderr?.toString() || '').toContain('Password is invalid');
      }
    });

    it('should validate using config file', () => {
      const result = execSync(
        `node ${cliPath} validate --password "Str1@Pa2#Zk" --config "${testConfigPath}"`,
        { encoding: 'utf8' }
      );
      expect(result).toContain('Password is valid');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing required arguments', () => {
      try {
        execSync(`node ${cliPath} validate`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
        throw new Error('Expected command to throw an error');
      } catch (error) {
        if (error.message === 'Expected command to throw an error') {
          throw error;
        }
        expect(error.status).not.toBe(0);
        expect(error.stderr?.toString() || '').toContain('Missing required argument: password');
      }
    });

    it('should handle invalid config file path', () => {
      try {
        execSync(
          `node ${cliPath} generate --config "nonexistent.cpc"`,
          { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
        );
        throw new Error('Expected command to throw an error');
      } catch (error) {
        if (error.message === 'Expected command to throw an error') {
          throw error;
        }
        expect(error.status).not.toBe(0);
        expect(error.stderr?.toString() || '').toContain('Config file not found');
      }
    });

    it('should handle invalid command', () => {
      try {
        execSync(`node ${cliPath} invalid-command`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
        throw new Error('Expected command to throw an error');
      } catch (error) {
        if (error.message === 'Expected command to throw an error') {
          throw error;
        }
        expect(error.status).not.toBe(0);
        expect(error.stderr?.toString() || '').toContain('Unknown argument: invalid-command');
      }
    });
  });

  describe('Help Commands', () => {
    it('should display general help', () => {
      const result = execSync(`node ${cliPath} --help`, { encoding: 'utf8' });
      expect(result).toContain('Commands:');
      expect(result).toContain('validate');
      expect(result).toContain('generate');
    });

    it('should display generate command help', () => {
      const result = execSync(`node ${cliPath} generate --help`, { encoding: 'utf8' });
      expect(result).toContain('generate');
      expect(result).toContain('--minLength');
      expect(result).toContain('--minDigits');
    });

    it('should display validate command help', () => {
      const result = execSync(`node ${cliPath} validate --help`, { encoding: 'utf8' });
      expect(result).toContain('validate');
      expect(result).toContain('--password');
    });
  });
});
