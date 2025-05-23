import { DocumentTypeTestHelper } from "./helpers/document-type-test-helper.js";
import GetDocumentTypeAncestorsTool from "../items/get/get-ancestors.js";
import GetDocumentTypeChildrenTool from "../items/get/get-children.js";
import GetAllDocumentTypesTool from "../items/get/get-all.js";
import { createSnapshotResult } from "@/test-helpers/create-snapshot-result.js";
import { jest } from "@jest/globals";
import { DocumentTypeFolderBuilder } from "./helpers/document-type-folder-builder.js";
import { DocumentTypeBuilder } from "./helpers/document-type-builder.js";
import { BLANK_UUID } from "@/constants/constants.js";
import { DocumentTypeTreeItemResponseModel } from "@/umb-management-api/schemas/index.js";

describe("document-type-tree", () => {
  const TEST_ROOT_NAME = "_Test Root DocumentType";
  const TEST_FOLDER_NAME = "_Test Folder DocumentType";
  const TEST_CHILD_NAME = "_Test Child DocumentType";
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DocumentTypeTestHelper.cleanup(TEST_ROOT_NAME);
    await DocumentTypeTestHelper.cleanup(TEST_CHILD_NAME);
    await DocumentTypeTestHelper.cleanup(TEST_FOLDER_NAME);
  });

  //can't test root as it will change throughout testing

  describe("children", () => {
    it("should get child items", async () => {
      // Create parent folder
      const folderBuilder = await new DocumentTypeFolderBuilder(
        TEST_FOLDER_NAME
      ).create();

      // Create child document type
      await new DocumentTypeBuilder()
        .withName(TEST_CHILD_NAME)
        .withParent(folderBuilder.getId())
        .create();

      const result = await GetDocumentTypeChildrenTool().handler(
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
      const result = await GetDocumentTypeChildrenTool().handler(
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
      const folderBuilder = await new DocumentTypeFolderBuilder(
        TEST_FOLDER_NAME
      ).create();

      const childBuilder = await new DocumentTypeBuilder()
        .withName(TEST_CHILD_NAME)
        .withParent(folderBuilder.getId())
        .create();

      const result = await GetDocumentTypeAncestorsTool().handler(
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
      const result = await GetDocumentTypeAncestorsTool().handler(
        {
          descendantId: BLANK_UUID,
        },
        { signal: new AbortController().signal }
      );

      expect(result).toMatchSnapshot();
    });
  });

  describe("get-all", () => {
    it("should get all document types including nested children", async () => {
      // Create a nested structure:
      // Root Folder
      //   └─ Child Folder
      //       └─ Grandchild Document Type
      const rootFolderBuilder = await new DocumentTypeFolderBuilder(
        TEST_FOLDER_NAME
      ).create();

      const childFolderBuilder = await new DocumentTypeFolderBuilder(
        TEST_CHILD_NAME
      ).withParent(rootFolderBuilder.getId())
      .create();

      const grandchildBuilder = await new DocumentTypeBuilder()
        .withName(TEST_ROOT_NAME)
        .withParent(childFolderBuilder.getId())
        .create();

      const result = await GetAllDocumentTypesTool().handler(
        {},
        { signal: new AbortController().signal }
      );

      // Parse the response
      const items = JSON.parse(result.content[0].text?.toString() ?? "[]") as DocumentTypeTreeItemResponseModel[];

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
