import { LanguageBuilder } from "./language-builder.js";
import { LanguageTestHelper } from "./language-helper.js";
import { jest } from "@jest/globals";

describe('LanguageBuilder', () => {
  const TEST_LANGUAGE_NAME = '_Test Builder Language';
  const TEST_LANGUAGE_ISO = 'en-GB';
  const TEST_FALLBACK_ISO = 'en';
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

  describe('construction', () => {
    it('should create a builder with default values', () => {
      const builder = new LanguageBuilder();
      // No direct build method, but we can check that isoCode is null
      expect(() => builder.getIsoCode()).toThrow('No language has been created yet');
    });
  });

  describe('builder methods', () => {
    let builder: LanguageBuilder;

    beforeEach(() => {
      builder = new LanguageBuilder();
    });

    it('should set name', () => {
      builder.withName(TEST_LANGUAGE_NAME);
      // No direct way to check, but should not throw
      expect(builder).toBeDefined();
    });

    it('should set isoCode', () => {
      builder.withIsoCode(TEST_LANGUAGE_ISO);
      expect(builder).toBeDefined();
    });

    it('should set isDefault', () => {
      builder.withIsDefault(true);
      expect(builder).toBeDefined();
    });

    it('should set isMandatory', () => {
      builder.withIsMandatory(true);
      expect(builder).toBeDefined();
    });

    it('should set fallbackIsoCode', () => {
      builder.withFallbackIsoCode(TEST_FALLBACK_ISO);
      expect(builder).toBeDefined();
    });

    it('should chain builder methods', () => {
      builder
        .withName(TEST_LANGUAGE_NAME)
        .withIsoCode(TEST_LANGUAGE_ISO)
        .withIsDefault(true)
        .withIsMandatory(true)
        .withFallbackIsoCode(TEST_FALLBACK_ISO);
      expect(builder).toBeDefined();
    });
  });

  describe('creation and retrieval', () => {
    it('should create and retrieve a language', async () => {
      const builder = await new LanguageBuilder()
        .withName(TEST_LANGUAGE_NAME)
        .withIsoCode(TEST_LANGUAGE_ISO)
        .withIsDefault(false)
        .withIsMandatory(false)
        .create();
      expect(builder.getIsoCode()).toBe(TEST_LANGUAGE_ISO);
      // Optionally, verify existence
      const exists = await LanguageTestHelper.verifyLanguage(TEST_LANGUAGE_ISO);
      expect(exists).toBe(true);
    });

    it('should require name and isoCode for creation', async () => {
      const builder = new LanguageBuilder().withName(TEST_LANGUAGE_NAME);
      await expect(builder.create()).rejects.toThrow();
    });
  });

  describe('error handling', () => {
    it('should throw error when getting isoCode before creation', () => {
      const builder = new LanguageBuilder().withName(TEST_LANGUAGE_NAME);
      expect(() => builder.getIsoCode()).toThrow('No language has been created yet');
    });
  });
}); 