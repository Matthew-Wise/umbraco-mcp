import { DocumentBlueprintTestHelper } from "./helpers/document-blueprint-test-helper.js";
import GetDocumentBlueprintAncestorsTreeTool from "../get/get-ancestors.js";
import GetDocumentBlueprintChildrenTreeTool from "../get/get-children.js";
import { createSnapshotResult } from "@/helpers/test-utils.js";
import { jest } from "@jest/globals";
import { DocumentBlueprintFolderBuilder } from "./helpers/document-blueprint-folder-builder.js";
import { DocumentBlueprintBuilder } from "./helpers/document-blueprint-builder.js";
import { BLANK_UUID } from "../../constants.js";
describe("document-blueprint-tree", () => {
  const TEST_ROOT_NAME = "_Test Root Blueprint";
  const TEST_FOLDER_NAME = "_Test Folder Blueprint";
  const TEST_CHILD_NAME = "_Test Child Blueprint";
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DocumentBlueprintTestHelper.cleanup(TEST_ROOT_NAME);
    await DocumentBlueprintTestHelper.cleanup(TEST_CHILD_NAME);
    await DocumentBlueprintTestHelper.cleanup(TEST_FOLDER_NAME);
  });

  //can't test root as it will change throughout testing

  describe("children", () => {
    it("should get child items", async () => {
      // Create parent folder
      const folderBuilder = await new DocumentBlueprintFolderBuilder(TEST_FOLDER_NAME)
        .create();

      // Create child blueprint
      await new DocumentBlueprintBuilder(TEST_CHILD_NAME)
        .withParent(folderBuilder.getId())
        .create();

      const result = await GetDocumentBlueprintChildrenTreeTool().handler({
        take: 100,
        parentId: folderBuilder.getId()
      }, { signal: new AbortController().signal });

      // Normalize and verify response
      const normalizedItems = createSnapshotResult(result);
      expect(normalizedItems).toMatchSnapshot();
    });

    it("should handle non-existent parent", async () => {
      const result = await GetDocumentBlueprintChildrenTreeTool().handler({
        take: 100,
        parentId: BLANK_UUID
      }, { signal: new AbortController().signal });

      expect(result).toMatchSnapshot();
    });
  });

  describe("ancestors", () => {
    it("should get ancestor items", async () => {
      // Create folder structure
      const folderBuilder = await new DocumentBlueprintFolderBuilder(TEST_FOLDER_NAME)
        .create();

      const childBuilder = await new DocumentBlueprintBuilder(TEST_CHILD_NAME)
        .withParent(folderBuilder.getId())
        .create();

      const result = await GetDocumentBlueprintAncestorsTreeTool().handler({
        descendantId: childBuilder.getId()
      }, { signal: new AbortController().signal });

      // Normalize and verify response
      const normalizedItems = createSnapshotResult(result);
      expect(normalizedItems).toMatchSnapshot();
    });

    it("should handle non-existent item", async () => {
      const result = await GetDocumentBlueprintAncestorsTreeTool().handler({
        descendantId: BLANK_UUID
      }, { signal: new AbortController().signal });

      expect(result).toMatchSnapshot();
    });
  });
}); 