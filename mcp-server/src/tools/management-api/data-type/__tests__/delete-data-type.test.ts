import DeleteDataTypeTool from "../delete/delete-data-type.js";
import { DataTypeBuilder } from "./helpers/data-type-builder.js";
import { DataTypeTestHelper } from "./helpers/data-type-test-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";
describe("delete-data-type", () => {
  const TEST_DATATYPE_NAME = "_Test DataType Delete";
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    // Clean up any remaining test data types
    await DataTypeTestHelper.cleanup(TEST_DATATYPE_NAME);
  });

  it("should delete a data type", async () => {
    // Create a data type to delete
    const builder = await new DataTypeBuilder()
      .withName(TEST_DATATYPE_NAME)
      .withTextbox()
      .create();

    // Delete the data type
    const result = await DeleteDataTypeTool().handler({
      id: builder.getId()
    }, { signal: new AbortController().signal });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the data type no longer exists
    const found = await DataTypeTestHelper.findDataType(TEST_DATATYPE_NAME);
    expect(found).toBeUndefined();
  });

  it("should handle non-existent data type", async () => {
    const result = await DeleteDataTypeTool().handler({
      id: BLANK_UUID
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });
}); 