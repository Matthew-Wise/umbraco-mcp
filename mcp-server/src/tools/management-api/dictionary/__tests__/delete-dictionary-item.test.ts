import DeleteDictionaryItemTool from "../delete/delete-dictionary-item.js";
import { DictionaryBuilder } from "./helpers/dictionary-builder.js";
import { DEFAULT_ISO_CODE, DictionaryTestHelper } from "./helpers/dictionary-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

const TEST_DICTIONARY_NAME = "_Test Dictionary Delete";
const TEST_DICTIONARY_TRANSLATION = "_Test Translation Delete";

describe("delete-dictionary-item", () => {
  let originalConsoleError: typeof console.error;
  let builder: DictionaryBuilder;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
    builder = new DictionaryBuilder();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
  });

  it("should delete a dictionary item", async () => {
    // Create initial dictionary item
    await builder
      .withName(TEST_DICTIONARY_NAME)
      .withTranslation(DEFAULT_ISO_CODE, TEST_DICTIONARY_TRANSLATION)
      .create();

    const result = await DeleteDictionaryItemTool().handler({
      id: builder.getId()
    }, { signal: new AbortController().signal });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the item no longer exists
    const items = await DictionaryTestHelper.findDictionaryItems(TEST_DICTIONARY_NAME);
    expect(items).toHaveLength(0);
  });

  it("should handle non-existent dictionary item", async () => {
    const result = await DeleteDictionaryItemTool().handler({
      id: BLANK_UUID
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });

}); 