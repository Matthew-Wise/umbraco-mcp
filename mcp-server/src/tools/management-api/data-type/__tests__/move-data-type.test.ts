import MoveDataTypeTool from "../put/move-data-type.js";
import { DataTypeBuilder } from "./helpers/data-type-builder.js";
import { DataTypeFolderBuilder } from "./helpers/data-type-folder-builder.js";
import { DataTypeTestHelper } from "./helpers/data-type-test-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";
describe("move-data-type", () => {
  const TEST_DATATYPE_NAME = "_Test DataType Move";
  const TEST_FOLDER_NAME = "_Test Folder";
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    // Clean up any test data types and folders
    await DataTypeTestHelper.cleanup(TEST_DATATYPE_NAME);
    await DataTypeTestHelper.cleanup(TEST_FOLDER_NAME);
  });

  it("should move a data type", async () => {
    // Create a folder
    const folderBuilder = await new DataTypeFolderBuilder(TEST_FOLDER_NAME)
      .create();

    // Create a data type to move
    const builder = await new DataTypeBuilder()
      .withName(TEST_DATATYPE_NAME)
      .withTextbox()
      .create();

    // Move the data type
    const result = await MoveDataTypeTool().handler({
      id: builder.getId(),
      data: {
        target: {
          id: folderBuilder.getId()
        }
      }
    }, { signal: new AbortController().signal });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the data type was moved
    const found = await DataTypeTestHelper.findDataType(TEST_DATATYPE_NAME);
    expect(found).toBeDefined();
    expect(found!.id).toBe(builder.getId());
  });

  it("should handle moving to non-existent folder", async () => {
    // Create a data type to move
    const builder = await new DataTypeBuilder()
      .withName(TEST_DATATYPE_NAME)
      .withTextbox()
      .create();

    const result = await MoveDataTypeTool().handler({
      id: builder.getId(),
      data: {
        target: {
          id: BLANK_UUID
        }
      }
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });

  it("should handle moving non-existent data type", async () => {
    const result = await MoveDataTypeTool().handler({
      id: BLANK_UUID,
      data: {
        target: {
          id: BLANK_UUID
        }
      }
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });
}); 