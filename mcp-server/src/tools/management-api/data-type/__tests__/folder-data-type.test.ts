import { DataTypeTestHelper } from "./helpers/data-type-test-helper.js";
import CreateDataTypeFolderTool from "../folders/post/create-folder.js";
import DeleteDataTypeFolderTool from "../folders/delete/delete-folder.js";
import UpdateDataTypeFolderTool from "../folders/put/update-folder.js";
import { createSnapshotResult } from "@/helpers/test-utils.js";
import { jest } from "@jest/globals";
import { DataTypeFolderBuilder } from "./helpers/data-type-folder-builder.js";
import { BLANK_UUID } from "../../constants.js";

describe("data-type-folder", () => {
  const TEST_FOLDER_NAME = "_Test DataType Folder";
  const TEST_PARENT_FOLDER_NAME = "_Test Parent DataType Folder";
  const UPDATE_FOLDER_NAME = "_Update DataType Folder Name";
  const UPDATED_FOLDER_NAME = "_Updated DataType Folder Name";
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DataTypeTestHelper.cleanup(TEST_FOLDER_NAME);
    await DataTypeTestHelper.cleanup(TEST_PARENT_FOLDER_NAME);
  });

  describe("create", () => {
    it("should create a folder", async () => {
      const result = await CreateDataTypeFolderTool().handler({
        name: TEST_FOLDER_NAME
      }, { signal: new AbortController().signal });

      expect(createSnapshotResult(result)).toMatchSnapshot();

      // Verify folder exists
      const found = await DataTypeTestHelper.findDataType(TEST_FOLDER_NAME);
      expect(found).toBeDefined();
      expect(found!.isFolder).toBe(true);
    });

    it("should create a folder with parent", async () => {
      // Create parent folder using builder
      const parentBuilder = await new DataTypeFolderBuilder(TEST_PARENT_FOLDER_NAME)
        .create();
      expect(parentBuilder).toBeDefined();

      const result = await CreateDataTypeFolderTool().handler({
        name: TEST_FOLDER_NAME,
        parent: { id: parentBuilder.getId() }
      }, { signal: new AbortController().signal });

      expect(createSnapshotResult(result)).toMatchSnapshot();

      // Verify folder exists under parent
      const found = await DataTypeTestHelper.findDataType(TEST_FOLDER_NAME);
      expect(found).toBeDefined();
      expect(found!.isFolder).toBe(true);
    });
  });

  describe("update", () => {
    it("should update a folder name", async () => {
      // Create folder to update using builder
      const builder = await new DataTypeFolderBuilder(UPDATE_FOLDER_NAME)
        .create();
      expect(builder).toBeDefined();

      const result = await UpdateDataTypeFolderTool().handler({
        id: builder.getId(),
        data: {
          name: UPDATED_FOLDER_NAME
        }
      }, { signal: new AbortController().signal });

      expect(result).toMatchSnapshot();

      // Verify folder was updated
      const found = await DataTypeTestHelper.findDataType(UPDATED_FOLDER_NAME);
      expect(found).toBeDefined();
      expect(found!.name).toBe(UPDATED_FOLDER_NAME);
      await DataTypeTestHelper.cleanup(UPDATED_FOLDER_NAME);
    });

    it("should handle non-existent folder", async () => {
      const result = await UpdateDataTypeFolderTool().handler({
        id: BLANK_UUID,
        data: {
          name: UPDATED_FOLDER_NAME
        }
      }, { signal: new AbortController().signal });

      expect(result).toMatchSnapshot();
    });
  });

  describe("delete", () => {
    it("should delete a folder", async () => {
      // Create folder to delete using builder
      const builder = await new DataTypeFolderBuilder(TEST_FOLDER_NAME)
        .create();
      expect(builder).toBeDefined();

      const result = await DeleteDataTypeFolderTool().handler({
        id: builder.getId()
      }, { signal: new AbortController().signal });

      expect(createSnapshotResult(result)).toMatchSnapshot();

      // Verify folder was deleted
      const found = await DataTypeTestHelper.findDataType(TEST_FOLDER_NAME);
      expect(found).toBeUndefined();
    });

    it("should handle non-existent folder", async () => {
      const result = await DeleteDataTypeFolderTool().handler({
        id: BLANK_UUID
      }, { signal: new AbortController().signal });

      expect(result).toMatchSnapshot();
    });
  });
}); 