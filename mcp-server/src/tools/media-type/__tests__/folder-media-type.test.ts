import { MediaTypeTestHelper } from "./helpers/media-type-helper.js";
import CreateMediaTypeFolderTool from "../folders/post/create-folder.js";
import DeleteMediaTypeFolderTool from "../folders/delete/delete-folder.js";
import UpdateMediaTypeFolderTool from "../folders/put/update-folder.js";
import { createSnapshotResult } from "@/helpers/test-utils.js";
import { jest } from "@jest/globals";
import { MediaTypeFolderBuilder } from "./helpers/media-type-folder-builder.js";
import { MediaTypeFolderTestHelper } from "./helpers/media-type-folder-helper.js";
import { BLANK_UUID } from "../../constants.js";

interface MediaTypeFolder {
  name: string;
  id: string;
  isFolder: boolean;
  parent?: { id: string };
}

describe("media-type-folder", () => {
  const TEST_FOLDER_NAME = "_Test MediaType Folder";
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
    await MediaTypeFolderTestHelper.cleanup(TEST_FOLDER_NAME);
    await MediaTypeFolderTestHelper.cleanup(TEST_PARENT_FOLDER_NAME);
    await MediaTypeFolderTestHelper.cleanup(UPDATE_FOLDER_NAME);
    await MediaTypeFolderTestHelper.cleanup(UPDATED_FOLDER_NAME);
  });

  describe("create", () => {
    it("should create a folder", async () => {
      const result = await CreateMediaTypeFolderTool().handler({
        name: TEST_FOLDER_NAME
      }, { signal: new AbortController().signal });

      expect(createSnapshotResult(result)).toMatchSnapshot();

      // Verify folder exists
      const found = await MediaTypeTestHelper.findMediaTypes(TEST_FOLDER_NAME);
      expect(found.length).toBeGreaterThan(0);
      expect(found[0].isFolder).toBe(true);
    });

    it("should create a folder with parent", async () => {
      // Create parent folder using builder
      const parentBuilder = await new MediaTypeFolderBuilder()
        .withName(TEST_PARENT_FOLDER_NAME)
        .create();
      expect(parentBuilder).toBeDefined();

      const result = await CreateMediaTypeFolderTool().handler({
        name: TEST_FOLDER_NAME,
        parent: { id: parentBuilder.getId() }
      }, { signal: new AbortController().signal });

      expect(createSnapshotResult(result)).toMatchSnapshot();

      // Verify folder exists under parent
      const found = await MediaTypeTestHelper.findMediaTypes(TEST_FOLDER_NAME);
      expect(found.length).toBeGreaterThan(0);
      expect(found[0].isFolder).toBe(true);
      expect(found[0].parent?.id).toBe(parentBuilder.getId());
    });
  });

  describe("update", () => {
    it("should update a folder name", async () => {
      // Create folder to update using builder
      const builder = await new MediaTypeFolderBuilder()
        .withName(UPDATE_FOLDER_NAME)
        .create();
      expect(builder).toBeDefined();

      const result = await UpdateMediaTypeFolderTool().handler({
        id: builder.getId(),
        data: {
          name: UPDATED_FOLDER_NAME
        }
      }, { signal: new AbortController().signal });

      expect(result).toMatchSnapshot();

      // Verify folder was updated
      const found = await MediaTypeTestHelper.findMediaTypes(UPDATED_FOLDER_NAME);
      expect(found.length).toBeGreaterThan(0);
      expect(found[0].name).toBe(UPDATED_FOLDER_NAME);
      await MediaTypeTestHelper.cleanup(UPDATED_FOLDER_NAME);
    });

    it("should handle non-existent folder", async () => {
      const result = await UpdateMediaTypeFolderTool().handler({
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
      const builder = await new MediaTypeFolderBuilder()
        .withName(TEST_FOLDER_NAME)
        .create();
      expect(builder).toBeDefined();

      const result = await DeleteMediaTypeFolderTool().handler({
        id: builder.getId()
      }, { signal: new AbortController().signal });

      expect(createSnapshotResult(result)).toMatchSnapshot();

      // Verify folder was deleted
      const found = await MediaTypeTestHelper.findMediaTypes(TEST_FOLDER_NAME);
      expect(found.length).toBe(0);
    });

    it("should handle non-existent folder", async () => {
      const result = await DeleteMediaTypeFolderTool().handler({
        id: BLANK_UUID
      }, { signal: new AbortController().signal });

      expect(result).toMatchSnapshot();
    });
  });
}); 