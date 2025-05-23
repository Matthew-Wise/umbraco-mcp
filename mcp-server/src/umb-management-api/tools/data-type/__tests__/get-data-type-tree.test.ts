import { DataTypeTestHelper } from "./helpers/data-type-test-helper.js";
import GetDataTypeAncestorsTool from "../items/get/get-ancestors.js";
import GetDataTypeChildrenTool from "../items/get/get-children.js";
import GetAllDataTypesTool from "../items/get/get-all.js";
import { createSnapshotResult } from "@/test-helpers/create-snapshot-result.js";
import { jest } from "@jest/globals";
import { DataTypeFolderBuilder } from "./helpers/data-type-folder-builder.js";
import { DataTypeBuilder } from "./helpers/data-type-builder.js";
import { BLANK_UUID } from "@/constants/constants.js";
import { DataTypeTreeItemResponseModel } from "@/umb-management-api/schemas/dataTypeTreeItemResponseModel.js";

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
      const folderBuilder = await new DataTypeFolderBuilder(
        TEST_FOLDER_NAME
      ).create();

      // Create child data type
      const builder = new DataTypeBuilder();
      await builder
        .withName(TEST_CHILD_NAME)
        .withTextbox()
        .withParent(folderBuilder.getId())
        .create();

      const result = await GetDataTypeChildrenTool().handler(
        {
          take: 100,
          parentId: folderBuilder.getId(),
        },
        { signal: new AbortController().signal }
      );

      // Normalize and verify response
      const normalizedItems = createSnapshotResult(result);
      expect(normalizedItems).toMatchSnapshot();
    });

    it("should handle non-existent parent", async () => {
      const result = await GetDataTypeChildrenTool().handler(
        {
          take: 100,
          parentId: BLANK_UUID,
        },
        { signal: new AbortController().signal }
      );

      expect(result).toMatchSnapshot();
    });
  });

  describe("ancestors", () => {
    it("should get ancestor items", async () => {
      // Create folder structure
      const folderBuilder = await new DataTypeFolderBuilder(
        TEST_FOLDER_NAME
      ).create();

      const builder = new DataTypeBuilder();
      const childBuilder = await builder
        .withName(TEST_CHILD_NAME)
        .withTextbox()
        .withParent(folderBuilder.getId())
        .create();

      const result = await GetDataTypeAncestorsTool().handler(
        {
          descendantId: childBuilder.getId(),
        },
        { signal: new AbortController().signal }
      );

      // Normalize and verify response
      const normalizedItems = createSnapshotResult(result);
      expect(normalizedItems).toMatchSnapshot();
    });

    it("should handle non-existent item", async () => {
      const result = await GetDataTypeAncestorsTool().handler(
        {
          descendantId: BLANK_UUID,
        },
        { signal: new AbortController().signal }
      );

      expect(result).toMatchSnapshot();
    });
  });

  describe("get-all", () => {
    it("should get all data types including nested children", async () => {
      // Create a nested structure:
      // Root Folder
      //   └─ Child Folder
      //       └─ Grandchild Data Type
      const rootFolderBuilder = await new DataTypeFolderBuilder(
        TEST_FOLDER_NAME
      ).create();

      const childFolderBuilder = await new DataTypeFolderBuilder(
        TEST_CHILD_NAME
      ).withParent(rootFolderBuilder.getId())
      .create();

      await new DataTypeBuilder()
        .withName(TEST_ROOT_NAME)
        .withTextbox()
        .withParent(childFolderBuilder.getId())
        .create();

      const result = await GetAllDataTypesTool().handler(
        {},
        { signal: new AbortController().signal }
      );

      // Parse the response
      const items = JSON.parse(result.content[0].text?.toString() ?? "[]") as DataTypeTreeItemResponseModel[];

      // Verify our test structure exists
      const rootFolder = items.find(item => item.name === TEST_FOLDER_NAME);
      const childFolder = items.find(item => item.name === TEST_CHILD_NAME);
      const grandchild = items.find(item => item.name === TEST_ROOT_NAME);

      expect(rootFolder).toBeDefined();
      expect(childFolder).toBeDefined();
      expect(grandchild).toBeDefined();

      // Verify the hierarchy
      expect(childFolder?.parent?.id).toBe(rootFolder?.id);
      expect(grandchild?.parent?.id).toBe(childFolder?.id);
    });
  });
});
