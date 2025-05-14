import { DocumentTypeTestHelper } from "./helpers/document-type-test-helper.js";
import CreateDocumentTypeFolderTool from "../folders/post/create-folder.js";
import DeleteDocumentTypeFolderTool from "../folders/delete/delete-folder.js";
import UpdateDocumentTypeFolderTool from "../folders/put/update-folder.js";
import { createSnapshotResult } from "@/helpers/test-utils.js";
import { jest } from "@jest/globals";
import { DocumentTypeFolderBuilder } from "./helpers/document-type-folder-builder.js";
import { BLANK_UUID } from "../../constants.js";

describe("document-type-folder", () => {
  const TEST_FOLDER_NAME = "_Test DocumentType Folder";
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
    await DocumentTypeTestHelper.cleanup(TEST_FOLDER_NAME);
    await DocumentTypeTestHelper.cleanup(TEST_PARENT_FOLDER_NAME);
  });

  describe("create", () => {
    it("should create a folder", async () => {
      const result = await CreateDocumentTypeFolderTool().handler({
        name: TEST_FOLDER_NAME
      }, { signal: new AbortController().signal });

      expect(createSnapshotResult(result)).toMatchSnapshot();

      // Verify folder exists
      const found = await DocumentTypeTestHelper.findDocumentType(TEST_FOLDER_NAME);
      expect(found).toBeDefined();
      expect(found!.isFolder).toBe(true);
    });

    it("should create a folder with parent", async () => {
      // Create parent folder using builder
      const parentBuilder = await new DocumentTypeFolderBuilder(TEST_PARENT_FOLDER_NAME)
        .create();
      expect(parentBuilder).toBeDefined();

      const result = await CreateDocumentTypeFolderTool().handler({
        name: TEST_FOLDER_NAME,
        parent: { id: parentBuilder.getId() }
      }, { signal: new AbortController().signal });

      expect(createSnapshotResult(result)).toMatchSnapshot();

      // Verify folder exists under parent
      const found = await DocumentTypeTestHelper.findDocumentType(TEST_FOLDER_NAME);
      expect(found).toBeDefined();
      expect(found!.isFolder).toBe(true);
    });
  });

  describe("update", () => {
    it("should update a folder name", async () => {
      // Create folder to update using builder
      const builder = await new DocumentTypeFolderBuilder(UPDATE_FOLDER_NAME)
        .create();
      expect(builder).toBeDefined();

      const result = await UpdateDocumentTypeFolderTool().handler({
        id: builder.getId(),
        data: {
          name: UPDATED_FOLDER_NAME
        }
      }, { signal: new AbortController().signal });

      expect(result).toMatchSnapshot();

      // Verify folder was updated
      const found = await DocumentTypeTestHelper.findDocumentType(UPDATED_FOLDER_NAME);
      expect(found).toBeDefined();
      expect(found!.name).toBe(UPDATED_FOLDER_NAME);
      await DocumentTypeTestHelper.cleanup(UPDATED_FOLDER_NAME);
    });

    it("should handle non-existent folder", async () => {
      const result = await UpdateDocumentTypeFolderTool().handler({
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
      const builder = await new DocumentTypeFolderBuilder(TEST_FOLDER_NAME)
        .create();
      expect(builder).toBeDefined();

      const result = await DeleteDocumentTypeFolderTool().handler({
        id: builder.getId()
      }, { signal: new AbortController().signal });

      expect(createSnapshotResult(result)).toMatchSnapshot();

      // Verify folder was deleted
      const found = await DocumentTypeTestHelper.findDocumentType(TEST_FOLDER_NAME);
      expect(found).toBeUndefined();
    });

    it("should handle non-existent folder", async () => {
      const result = await DeleteDocumentTypeFolderTool().handler({
        id: BLANK_UUID
      }, { signal: new AbortController().signal });

      expect(result).toMatchSnapshot();
    });
  });
}); 