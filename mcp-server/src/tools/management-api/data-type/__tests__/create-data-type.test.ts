import CreateDataTypeTool from "../post/create-data-type.js";
import { DataTypeBuilder } from "./helpers/data-type-builder.js";
import { DataTypeTestHelper } from "./helpers/data-type-test-helper.js";
import { jest } from "@jest/globals";

const TEST_DATATYPE_NAME = "_Test DataType Created";
const EXISTING_DATATYPE_NAME = "_Existing DataType";

describe("create-data-type", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    // Clean up any test data types
    await DataTypeTestHelper.cleanup(TEST_DATATYPE_NAME);
    await DataTypeTestHelper.cleanup(EXISTING_DATATYPE_NAME);
  });

  it("should create a data type", async () => {
    // Create data type model using builder
    const dataTypeModel = new DataTypeBuilder()
      .withName(TEST_DATATYPE_NAME)
      .withTextbox()
      .build();

    // Create the data type
    const result = await CreateDataTypeTool().handler(dataTypeModel, {
      signal: new AbortController().signal
    }); 

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the created item exists and matches expected values
    const item = await DataTypeTestHelper.findDataType(TEST_DATATYPE_NAME);
    expect(item).toBeDefined();
    expect(DataTypeTestHelper.normaliseIds(item!)).toMatchSnapshot();
  });

}); 