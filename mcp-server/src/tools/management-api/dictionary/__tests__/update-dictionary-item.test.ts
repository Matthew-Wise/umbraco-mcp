import UpdateDictionaryItemTool from "../put/update-dictionary-item.js";
import { DictionaryBuilder } from "./helpers/dictionary-builder.js";
import { DEFAULT_ISO_CODE, DictionaryTestHelper } from "./helpers/dictionary-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

const TEST_DICTIONARY_NAME = "_Test Dictionary Update";
const TEST_DICTIONARY_TRANSLATION = "_Test Translation Update";
const UPDATED_DICTIONARY_NAME = "_Updated Dictionary";
const UPDATED_DICTIONARY_TRANSLATION = "_Updated Translation";
const NON_EXISTENT_DICTIONARY_NAME = "_Non Existent Dictionary";
const NON_EXISTENT_DICTIONARY_TRANSLATION = "_Non Existent Translation";

describe("update-dictionary-item", () => {
  let originalConsoleError: typeof console.error;
  let helper: DictionaryBuilder;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
    helper = new DictionaryBuilder();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await helper.cleanup();
  });

  it("should update a dictionary item", async () => {
    // Create initial dictionary item
    await helper
      .withName(TEST_DICTIONARY_NAME)
      .withTranslation(DEFAULT_ISO_CODE, TEST_DICTIONARY_TRANSLATION)
      .create();

    const result = await UpdateDictionaryItemTool().handler({
      id: helper.getId(),
      data: {
        name: UPDATED_DICTIONARY_NAME,
        translations: [{ isoCode: DEFAULT_ISO_CODE, translation: UPDATED_DICTIONARY_TRANSLATION }]
      }
    }, { signal: new AbortController().signal });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the updated item exists and matches expected values
    const items = await DictionaryTestHelper.findDictionaryItems(UPDATED_DICTIONARY_NAME, true);
    expect(items).toMatchSnapshot();
  });

  it("should handle non-existent dictionary item", async () => {
    const result = await UpdateDictionaryItemTool().handler({
      id: BLANK_UUID,
      data: {
        name: NON_EXISTENT_DICTIONARY_NAME,
        translations: [{ isoCode: DEFAULT_ISO_CODE, translation: NON_EXISTENT_DICTIONARY_TRANSLATION }]
      }
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });
}); 