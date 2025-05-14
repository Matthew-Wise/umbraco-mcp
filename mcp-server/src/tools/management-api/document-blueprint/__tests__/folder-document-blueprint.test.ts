import { DocumentBlueprintTestHelper } from "./helpers/document-blueprint-test-helper.js";
import CreateDocumentBlueprintFolderTool from "../folders/post/create-folder.js";
import DeleteDocumentBlueprintFolderTool from "../folders/delete/delete-folder.js";
import UpdateDocumentBlueprintFolderTool from "../folders/put/update-folder.js";
import { createSnapshotResult } from "@/helpers/test-utils.js";
import { jest } from "@jest/globals";
import { DocumentBlueprintFolderBuilder } from "./helpers/document-blueprint-folder-builder.js";
import { BLANK_UUID } from "../../constants.js";

describe("document-blueprint-folder", () => {
  const TEST_FOLDER_NAME = "_Test Blueprint Folder";
  const TEST_PARENT_FOLDER_NAME = "_Test Parent Folder";
  const UPDATE_FOLDER_NAME = "_Update Folder Name";
  const UPDATED_FOLDER_NAME = "_Updated Folder Name";
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DocumentBlueprintTestHelper.cleanup(TEST_FOLDER_NAME);
    await DocumentBlueprintTestHelper.cleanup(TEST_PARENT_FOLDER_NAME);
  });

  describe("create", () => {
    it("should create a folder", async () => {
      const result = await CreateDocumentBlueprintFolderTool().handler({
        name: TEST_FOLDER_NAME
      }, { signal: new AbortController().signal });

      expect(createSnapshotResult(result)).toMatchSnapshot();

      // Verify folder exists
      const found = await DocumentBlueprintTestHelper.findDocumentBlueprint(TEST_FOLDER_NAME);
      expect(found).toBeDefined();
      expect(found!.isFolder).toBe(true);
    });

    it("should create a folder with parent", async () => {
      // Create parent folder using builder
      const parentBuilder = await new DocumentBlueprintFolderBuilder(TEST_PARENT_FOLDER_NAME)
        .create();
      expect(parentBuilder).toBeDefined();

      const result = await CreateDocumentBlueprintFolderTool().handler({
        name: TEST_FOLDER_NAME,
        parent: { id: parentBuilder.getId() }
      }, { signal: new AbortController().signal });

      expect(createSnapshotResult(result)).toMatchSnapshot();

      // Verify folder exists under parent
      const found = await DocumentBlueprintTestHelper.findDocumentBlueprint(TEST_FOLDER_NAME);
      expect(found).toBeDefined();
      expect(found!.isFolder).toBe(true);
    });
  });

  describe("update", () => {
    it("should update a folder name", async () => {
      // Create folder to update using builder
      const builder = await new DocumentBlueprintFolderBuilder(UPDATE_FOLDER_NAME)
        .create();
      expect(builder).toBeDefined();

      const result = await UpdateDocumentBlueprintFolderTool().handler({
        id: builder.getId(),
        data: {
          name: UPDATED_FOLDER_NAME
        }
      }, { signal: new AbortController().signal });

      expect(result).toMatchSnapshot();

      // Verify folder was updated
      const found = await DocumentBlueprintTestHelper.findDocumentBlueprint(UPDATED_FOLDER_NAME);
      expect(found).toBeDefined();
      expect(found!.name).toBe(UPDATED_FOLDER_NAME);
      await DocumentBlueprintTestHelper.cleanup(UPDATED_FOLDER_NAME);
    });

    it("should handle non-existent folder", async () => {
      const result = await UpdateDocumentBlueprintFolderTool().handler({
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
      const builder = await new DocumentBlueprintFolderBuilder(TEST_FOLDER_NAME)
        .create();
      expect(builder).toBeDefined();

      const result = await DeleteDocumentBlueprintFolderTool().handler({
        id: builder.getId()
      }, { signal: new AbortController().signal });

      expect(createSnapshotResult(result)).toMatchSnapshot();

      // Verify folder was deleted
      const found = await DocumentBlueprintTestHelper.findDocumentBlueprint(TEST_FOLDER_NAME);
      expect(found).toBeUndefined();
    });

    it("should handle non-existent folder", async () => {
      const result = await DeleteDocumentBlueprintFolderTool().handler({
        id: BLANK_UUID
      }, { signal: new AbortController().signal });

      expect(result).toMatchSnapshot();
    });
  });
}); 