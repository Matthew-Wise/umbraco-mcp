import GetDataTypesByIdArrayTool from "../get/get-data-type-by-id-array.js";
import { DataTypeBuilder } from "./helpers/data-type-builder.js";
import { DataTypeTestHelper } from "./helpers/data-type-test-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";
describe("get-item-data-type", () => {
  const TEST_DATATYPE_NAME = "_Test Item DataType";
  const TEST_DATATYPE_NAME_2 = "_Test Item DataType2";
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
    await DataTypeTestHelper.cleanup(TEST_DATATYPE_NAME);
    await DataTypeTestHelper.cleanup(TEST_DATATYPE_NAME_2);
  });

  it("should get no data types for empty request", async () => {
    // Get all data types
    const result = await GetDataTypesByIdArrayTool().handler({}, { signal: new AbortController().signal });
    const items = parseItems(result.content[0].text as string);
    expect(items).toMatchSnapshot();
  });

  it("should get single data type by ID", async () => {
    // Create a data type
    const builder = await new DataTypeBuilder()
      .withName(TEST_DATATYPE_NAME)
      .withTextbox()
      .create();

    // Get by ID
    const result = await GetDataTypesByIdArrayTool().handler({ id: [builder.getId()] }, { signal: new AbortController().signal });
    const items = parseItems(result.content[0].text as string);
    expect(items).toHaveLength(1);
    expect(items[0].name).toBe(TEST_DATATYPE_NAME);
    // Normalize for snapshot
    items[0].id = BLANK_UUID;
    expect(items).toMatchSnapshot();
  });

  it("should get multiple data types by ID", async () => {
    // Create first data type
    const builder1 = await new DataTypeBuilder()
      .withName(TEST_DATATYPE_NAME)
      .withTextbox()
      .create();

    // Create second data type
    const builder2 = await new DataTypeBuilder()
      .withName(TEST_DATATYPE_NAME_2)
      .withTextbox()
      .create();

    // Get by IDs
    const result = await GetDataTypesByIdArrayTool().handler({ 
      id: [builder1.getId(), builder2.getId()]
    }, { signal: new AbortController().signal });
    
    const items = parseItems(result.content[0].text as string);
    expect(items).toHaveLength(2);
    expect(items[0].name).toBe(TEST_DATATYPE_NAME);
    expect(items[1].name).toBe(TEST_DATATYPE_NAME_2);
    
    // Normalize for snapshot
    items.forEach((item: any) => {
      item.id = BLANK_UUID;
    });
    expect(items).toMatchSnapshot();
  });
}); 