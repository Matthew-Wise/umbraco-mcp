import GetLanguageItemsTool from "../get/get-language-items.js";
import { LanguageBuilder } from "./helpers/language-builder.js";
import { LanguageTestHelper } from "./helpers/language-helper.js";
import { jest } from "@jest/globals";

describe("get-language-items", () => {
  const TEST_LANGUAGE_NAME = "_Test Language Items";
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

  it("should get language item by isoCode", async () => {
    // Ensure the test language exists
    await builder
      .withName(TEST_LANGUAGE_NAME)
      .withIsoCode(TEST_LANGUAGE_ISO)
      .withIsDefault(false)
      .withIsMandatory(false)
      .create();

    const result = await GetLanguageItemsTool().handler({ isoCode: [TEST_LANGUAGE_ISO] }, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();
  });

  it("should handle non-existent isoCode", async () => {
    const result = await GetLanguageItemsTool().handler({ isoCode: ["xx-NOTFOUND"] }, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();
  });
}); 