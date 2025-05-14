import { DataTypeTestHelper } from "./helpers/data-type-test-helper.js";
import GetDataTypeAncestorsTool from "../items/get/get-ancestors.js";
import GetDataTypeChildrenTool from "../items/get/get-children.js"
import { createSnapshotResult } from "@/helpers/test-utils.js";
import { jest } from "@jest/globals";
import { DataTypeFolderBuilder } from "./helpers/data-type-folder-builder.js";
import { DataTypeBuilder } from "./helpers/data-type-builder.js";
import { BLANK_UUID } from "../../constants.js";

describe("data-type-tree", () => {
  const TEST_ROOT_NAME = "_Test Root DataType";
  const TEST_FOLDER_NAME = "_Test Folder DataType";
  const TEST_CHILD_NAME = "_Test Child DataType";
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DataTypeTestHelper.cleanup(TEST_ROOT_NAME);
    await DataTypeTestHelper.cleanup(TEST_CHILD_NAME);
    await DataTypeTestHelper.cleanup(TEST_FOLDER_NAME);
  });

  //can't test root as it will change throughout testing

  describe("children", () => {
    it("should get child items", async () => {
      // Create parent folder
      const folderBuilder = await new DataTypeFolderBuilder(TEST_FOLDER_NAME)
        .create();

      // Create child data type
      const builder = new DataTypeBuilder();
      await builder
        .withName(TEST_CHILD_NAME)
        .withTextbox()
        .withParent(folderBuilder.getId())
        .create();

      const result = await GetDataTypeChildrenTool().handler({
        take: 100,
        parentId: folderBuilder.getId()
      }, { signal: new AbortController().signal });

      // Normalize and verify response
      const normalizedItems = createSnapshotResult(result);
      expect(normalizedItems).toMatchSnapshot();
    });

    it("should handle non-existent parent", async () => {
      const result = await GetDataTypeChildrenTool().handler({
        take: 100,
        parentId: BLANK_UUID
      }, { signal: new AbortController().signal });

      expect(result).toMatchSnapshot();
    });
  });

  describe("ancestors", () => {
    it("should get ancestor items", async () => {
      // Create folder structure
      const folderBuilder = await new DataTypeFolderBuilder(TEST_FOLDER_NAME)
        .create();

      const builder = new DataTypeBuilder();
      const childBuilder = await builder
        .withName(TEST_CHILD_NAME)
        .withTextbox()
        .withParent(folderBuilder.getId())
        .create();

      const result = await GetDataTypeAncestorsTool().handler({
        descendantId: childBuilder.getId()
      }, { signal: new AbortController().signal });

      // Normalize and verify response
      const normalizedItems = createSnapshotResult(result);
      expect(normalizedItems).toMatchSnapshot();
    });

    it("should handle non-existent item", async () => {
      const result = await GetDataTypeAncestorsTool().handler({
        descendantId: BLANK_UUID
      }, { signal: new AbortController().signal });

      expect(result).toMatchSnapshot();
    });
  });
}); 