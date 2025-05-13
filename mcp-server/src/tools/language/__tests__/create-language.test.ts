import CreateLanguageTool from "../post/create-language.js";
import { LanguageBuilder } from "./helpers/language-builder.js";
import { LanguageTestHelper } from "./helpers/language-helper.js";
import { jest } from "@jest/globals";

const TEST_LANGUAGE_NAME = '_Test Create Language';
const TEST_LANGUAGE_ISO = 'en-GB';
const EXISTING_LANGUAGE_NAME = '_Existing Language';
const EXISTING_LANGUAGE_ISO = 'en';

// Helper to parse tool response
function parseResult(result: any) {
  try {
    return JSON.parse(result.content[0].text);
  } catch {
    return result.content[0].text;
  }
}

describe("create-language", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    await LanguageTestHelper.cleanup(TEST_LANGUAGE_ISO);
    await LanguageTestHelper.cleanup(EXISTING_LANGUAGE_ISO);
    console.error = originalConsoleError;
  });

  it("should create a language", async () => {
    // Create language model using builder
    const builder = new LanguageBuilder()
      .withName(TEST_LANGUAGE_NAME)
      .withIsoCode(TEST_LANGUAGE_ISO)
      .withIsDefault(false)
      .withIsMandatory(false);
    // Use a build() method to get a fully-typed model
    const languageModel = {
      name: TEST_LANGUAGE_NAME,
      isoCode: TEST_LANGUAGE_ISO,
      isDefault: false,
      isMandatory: false,
      fallbackIsoCode: null
    };

    // Create the language
    const result = await CreateLanguageTool().handler(languageModel, {
      signal: new AbortController().signal
    });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the created item exists and matches expected values
    const exists = await LanguageTestHelper.verifyLanguage(TEST_LANGUAGE_ISO);
    expect(exists).toBe(true);
    const language = await LanguageTestHelper.getLanguage(TEST_LANGUAGE_ISO);
    expect(language.name).toBe(TEST_LANGUAGE_NAME);
    expect(language.isoCode).toBe(TEST_LANGUAGE_ISO);
  });

  it("should handle existing language", async () => {
    // Create language model
    await new LanguageBuilder()
      .withName(EXISTING_LANGUAGE_NAME)
      .withIsoCode(EXISTING_LANGUAGE_ISO)
      .withIsDefault(false)
      .withIsMandatory(false);
    const languageModel = {
      name: EXISTING_LANGUAGE_NAME,
      isoCode: EXISTING_LANGUAGE_ISO,
      isDefault: false,
      isMandatory: false,
      fallbackIsoCode: null
    };

    // First create the language
    await CreateLanguageTool().handler(languageModel, {
      signal: new AbortController().signal
    });

    // Try to create it again
    const result = await CreateLanguageTool().handler(languageModel, {
      signal: new AbortController().signal
    });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });
}); 