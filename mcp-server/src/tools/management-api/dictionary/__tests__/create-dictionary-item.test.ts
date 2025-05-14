import CreateDictionaryItemTool from "../post/create-dictionary-item.js";
import { DEFAULT_ISO_CODE, DictionaryTestHelper } from "./helpers/dictionary-helper.js";
import { jest } from "@jest/globals";

const TEST_DICTIONARY_NAME = "_Test Dictionary Created";
const TEST_DICTIONARY_TRANSLATION = "_Test Translation";
const EXISTING_DICTIONARY_NAME = "_Existing Dictionary";
const EXISTING_DICTIONARY_TRANSLATION = "_Existing Translation";

describe("create-dictionary-item", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    // Clean up any test dictionary items
    await DictionaryTestHelper.cleanup(TEST_DICTIONARY_NAME);
    await DictionaryTestHelper.cleanup(EXISTING_DICTIONARY_NAME);
  });

  it("should create a dictionary item", async () => {
    const result = await CreateDictionaryItemTool().handler({
      name: TEST_DICTIONARY_NAME,
      translations: [{ isoCode: DEFAULT_ISO_CODE, translation: TEST_DICTIONARY_TRANSLATION }]
    }, { signal: new AbortController().signal });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the created item exists and matches expected values
    const items = await DictionaryTestHelper.findDictionaryItems(TEST_DICTIONARY_NAME, true);
    expect(items).toMatchSnapshot();
  });

  it("should handle existing dictionary item", async () => {
    // First create the item
    await CreateDictionaryItemTool().handler({
      name: EXISTING_DICTIONARY_NAME,
      translations: [{ isoCode: DEFAULT_ISO_CODE, translation: EXISTING_DICTIONARY_TRANSLATION }]
    }, { signal: new AbortController().signal });

    // Try to create it again
    const result = await CreateDictionaryItemTool().handler({
      name: EXISTING_DICTIONARY_NAME,
      translations: [{ isoCode: DEFAULT_ISO_CODE, translation: EXISTING_DICTIONARY_TRANSLATION }]
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });
}); 