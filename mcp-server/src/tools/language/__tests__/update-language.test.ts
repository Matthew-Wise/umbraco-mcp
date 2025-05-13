import UpdateLanguageTool from "../put/update-language.js";
import { LanguageBuilder } from "./helpers/language-builder.js";
import { LanguageTestHelper } from "./helpers/language-helper.js";
import { jest } from "@jest/globals";

const TEST_LANGUAGE_NAME = '_Test Update Language';
const TEST_LANGUAGE_ISO = 'en-GB';
const UPDATED_LANGUAGE_NAME = '_Test Updated Language';

function parseResult(result: any) {
  try {
    return JSON.parse(result.content[0].text);
  } catch {
    return result.content[0].text;
  }
}

describe("update-language", () => {
  let originalConsoleError: typeof console.error;
  let builder: LanguageBuilder;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
    builder = new LanguageBuilder();
  });

  afterEach(async () => {
    await builder.cleanup();
    await LanguageTestHelper.cleanup(TEST_LANGUAGE_ISO);
    console.error = originalConsoleError;
  });

  it("should update an existing language", async () => {
    // Create a language to update
    await builder
      .withName(TEST_LANGUAGE_NAME)
      .withIsoCode(TEST_LANGUAGE_ISO)
      .withIsDefault(false)
      .withIsMandatory(false)
      .create();

    // Prepare update model
    const updateModel = {
      name: UPDATED_LANGUAGE_NAME,
      isDefault: false,
      isMandatory: true,
      fallbackIsoCode: null
    };

    // Update the language
    const result = await UpdateLanguageTool().handler({
      isoCode: builder.getIsoCode(),
      data: updateModel
    }, { signal: new AbortController().signal });

    // Verify the handler response using snapshot
    expect(parseResult(result)).toMatchSnapshot();

    // Verify the language was updated
    const exists = await LanguageTestHelper.verifyLanguage(TEST_LANGUAGE_ISO);
    expect(exists).toBe(true);
    const language = await LanguageTestHelper.getLanguage(TEST_LANGUAGE_ISO);
    expect(language.name).toBe(UPDATED_LANGUAGE_NAME);
    expect(language.isMandatory).toBe(true);
  });

  it("should handle non-existent language", async () => {
    const nonExistentIso = "xx-XX";
    const updateModel = {
      name: UPDATED_LANGUAGE_NAME,
      isDefault: false,
      isMandatory: true,
      fallbackIsoCode: null
    };

    const result = await UpdateLanguageTool().handler({
      isoCode: nonExistentIso,
      data: updateModel
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });
}); 