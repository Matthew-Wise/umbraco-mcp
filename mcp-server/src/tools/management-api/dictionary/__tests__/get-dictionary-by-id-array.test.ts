import GetDictionaryByIdArrayTool from "../get/get-dictionary-by-id-array.js";
import { DictionaryBuilder } from "./helpers/dictionary-builder.js";
import { DictionaryTestHelper, DEFAULT_ISO_CODE } from "./helpers/dictionary-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";
describe("get-item-dictionary", () => {
  const TEST_DICTIONARY_NAME = "_Test Item Dictionary";
  const TEST_DICTIONARY_NAME_2 = "_Test Item Dictionary2";
  let originalConsoleError: typeof console.error;

  // Helper to parse response, handling empty string as empty array
  const parseItems = (text: string) => {
    if (!text || text.trim() === "") return [];
    return JSON.parse(text);
  };

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DictionaryTestHelper.cleanup(TEST_DICTIONARY_NAME);
    await DictionaryTestHelper.cleanup(TEST_DICTIONARY_NAME_2);
  });

  it("should get no dictionary items for empty request", async () => {
    // Get all dictionary items
    const result = await GetDictionaryByIdArrayTool().handler({}, { signal: new AbortController().signal });
    const items = parseItems(result.content[0].text as string);
    expect(items).toMatchSnapshot();
  });

  it("should get single dictionary item by ID", async () => {
    // Create a dictionary item
    const builder = await new DictionaryBuilder()
      .withName(TEST_DICTIONARY_NAME)
      .withTranslation(DEFAULT_ISO_CODE, "Test Value")
      .create();

    // Get by ID
    const result = await GetDictionaryByIdArrayTool().handler({ id: [builder.getId()] }, { signal: new AbortController().signal });
    const items = parseItems(result.content[0].text as string);
    expect(items).toHaveLength(1);
    expect(items[0].name).toBe(TEST_DICTIONARY_NAME);
    // Normalize for snapshot
    items[0].id = BLANK_UUID;
    expect(items).toMatchSnapshot();
  });

  it("should get multiple dictionary items by ID", async () => {
    // Create first dictionary item
    const builder1 = await new DictionaryBuilder()
      .withName(TEST_DICTIONARY_NAME)
      .withTranslation(DEFAULT_ISO_CODE, "Test Value 1")
      .create();

    // Create second dictionary item
    const builder2 = await new DictionaryBuilder()
      .withName(TEST_DICTIONARY_NAME_2)
      .withTranslation(DEFAULT_ISO_CODE, "Test Value 2")
      .create();

    // Get by IDs
    const result = await GetDictionaryByIdArrayTool().handler({ 
      id: [builder1.getId(), builder2.getId()]
    }, { signal: new AbortController().signal });
    
    const items = parseItems(result.content[0].text as string);
    expect(items).toHaveLength(2);
    expect(items[0].name).toBe(TEST_DICTIONARY_NAME);
    expect(items[1].name).toBe(TEST_DICTIONARY_NAME_2);
    
    // Normalize for snapshot
    items.forEach((item: any) => {
      item.id = BLANK_UUID;
    });
    expect(items).toMatchSnapshot();
  });
}); 