import FindDictionaryItemTool from "../get/find-dictionary-item.js";
import { DictionaryBuilder } from "./helpers/dictionary-builder.js";
import { DEFAULT_ISO_CODE } from "./helpers/dictionary-helper.js";
import { createSnapshotResult } from "../../../helpers/test-utils.js";
import { jest } from "@jest/globals";

const TEST_DICTIONARY_NAME = "_Test Dictionary Find";
const TEST_DICTIONARY_TRANSLATION = "_Test Translation Find";

describe("find-dictionary-item", () => {
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

  it("should find a dictionary item by name", async () => {
    // Create a dictionary item first
    await helper
      .withName(TEST_DICTIONARY_NAME)
      .withTranslation(DEFAULT_ISO_CODE, TEST_DICTIONARY_TRANSLATION)
      .create();

    const result = await FindDictionaryItemTool().handler({
      filter: TEST_DICTIONARY_NAME,
      take: 100
    }, { signal: new AbortController().signal });

    expect(createSnapshotResult(result)).toMatchSnapshot();
  });

  it("should handle non-existent dictionary item", async () => {
    const result = await FindDictionaryItemTool().handler({
      filter: "Non Existent Dictionary",
      take: 100
    }, { signal: new AbortController().signal });

    expect(result).toMatchSnapshot();
  });
}); 