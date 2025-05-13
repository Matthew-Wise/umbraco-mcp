import DeleteLanguageTool from "../delete/delete-language.js";
import { LanguageBuilder } from "./helpers/language-builder.js";
import { LanguageTestHelper } from "./helpers/language-helper.js";
import { jest } from "@jest/globals";

describe("delete-language", () => {
  const TEST_LANGUAGE_NAME = "_Test Language Delete";
  const TEST_LANGUAGE_ISO = "en-GB";
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

  it("should delete a language", async () => {
    // Create a language to delete
    await builder
      .withName(TEST_LANGUAGE_NAME)
      .withIsoCode(TEST_LANGUAGE_ISO)
      .withIsDefault(false)
      .withIsMandatory(false)
      .create();

    // Delete the language
    const result = await DeleteLanguageTool().handler({
      isoCode: builder.getIsoCode()
    }, { signal: new AbortController().signal });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the language no longer exists
    const exists = await LanguageTestHelper.verifyLanguage(TEST_LANGUAGE_ISO);
    expect(exists).toBe(false);
  });

  it("should handle non-existent language", async () => {
    const nonExistentIso = "xx-DEL";
    const result = await DeleteLanguageTool().handler({
      isoCode: nonExistentIso
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });
}); 