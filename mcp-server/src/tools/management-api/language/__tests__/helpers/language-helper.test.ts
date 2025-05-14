import { LanguageBuilder } from "./language-builder.js";
import { LanguageTestHelper } from "./language-helper.js";
import { jest } from "@jest/globals";

const TEST_LANGUAGE_NAME = '_Test Helper Language';
const TEST_LANGUAGE_ISO = 'en-GB';
const TEST_FALLBACK_ISO = 'en';

describe('LanguageTestHelper', () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    await LanguageTestHelper.cleanup(TEST_LANGUAGE_ISO);
    await LanguageTestHelper.cleanup(TEST_FALLBACK_ISO);
    console.error = originalConsoleError;
  });

  describe('verifyLanguage', () => {
    it('should return false for non-existent language', async () => {
      const exists = await LanguageTestHelper.verifyLanguage('not-a-real-iso');
      expect(exists).toBe(false);
    });

    it('should return true for an existing language', async () => {
      await new LanguageBuilder()
        .withName(TEST_LANGUAGE_NAME)
        .withIsoCode(TEST_LANGUAGE_ISO)
        .withIsDefault(false)
        .withIsMandatory(false)
        .create();
      const exists = await LanguageTestHelper.verifyLanguage(TEST_LANGUAGE_ISO);
      expect(exists).toBe(true);
    });
  });

  describe('getLanguage', () => {
    it('should throw for non-existent language', async () => {
      await expect(LanguageTestHelper.getLanguage('not-a-real-iso')).rejects.toThrow();
    });

    it('should return language data for an existing language', async () => {
      await new LanguageBuilder()
        .withName(TEST_LANGUAGE_NAME)
        .withIsoCode(TEST_LANGUAGE_ISO)
        .withIsDefault(false)
        .withIsMandatory(false)
        .create();
      const language = await LanguageTestHelper.getLanguage(TEST_LANGUAGE_ISO);
      expect(language.name).toBe(TEST_LANGUAGE_NAME);
      expect(language.isoCode).toBe(TEST_LANGUAGE_ISO);
    });
  });

  describe('cleanup', () => {
    it('should remove a language if it exists', async () => {
      await new LanguageBuilder()
        .withName(TEST_LANGUAGE_NAME)
        .withIsoCode(TEST_LANGUAGE_ISO)
        .withIsDefault(false)
        .withIsMandatory(false)
        .create();
      // Should exist before cleanup
      expect(await LanguageTestHelper.verifyLanguage(TEST_LANGUAGE_ISO)).toBe(true);
      await LanguageTestHelper.cleanup(TEST_LANGUAGE_ISO);
      // Should not exist after cleanup
      expect(await LanguageTestHelper.verifyLanguage(TEST_LANGUAGE_ISO)).toBe(false);
    });

    it('should not throw if language does not exist', async () => {
      await expect(LanguageTestHelper.cleanup('not-a-real-iso')).resolves.not.toThrow();
    });
  });
}); 