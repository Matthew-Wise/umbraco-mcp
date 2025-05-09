import { MediaTypeTestHelper } from "./helpers/media-type-helper.js";
import GetMediaTypeAncestorsTool from "../items/get/get-ancestors.js";
import GetMediaTypeChildrenTool from "../items/get/get-children.js";
import { createSnapshotResult } from "@/helpers/test-utils.js";
import { jest } from "@jest/globals";
import { MediaTypeFolderBuilder } from "./helpers/media-type-folder-builder.js";
import { MediaTypeBuilder } from "./helpers/media-type-builder.js";
import { BLANK_UUID } from "../../constants.js";    
import { MediaTypeFolderTestHelper } from "./helpers/media-type-folder-helper.js";

describe("media-type-tree", () => {
  const TEST_ROOT_NAME = "_Test Root MediaType";
  const TEST_FOLDER_NAME = "_Test Folder MediaType";
  const TEST_CHILD_NAME = "_Test Child MediaType";
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await MediaTypeTestHelper.cleanup(TEST_ROOT_NAME);
    await MediaTypeTestHelper.cleanup(TEST_CHILD_NAME);
    await MediaTypeFolderTestHelper.cleanup(TEST_FOLDER_NAME);
  });

  //can't test root as it will change throughout testing

  describe("children", () => {
    it("should get child items", async () => {
      // Create parent folder
      const folderBuilder = await new MediaTypeFolderBuilder()
        .withName(TEST_FOLDER_NAME)
        .create();

      // Create child media type
      await new MediaTypeBuilder()
        .withName(TEST_CHILD_NAME)
        .withIcon("icon-folder")
        .withParent(folderBuilder.getId())
        .create();

      const result = await GetMediaTypeChildrenTool().handler({
        take: 100,
        parentId: folderBuilder.getId()
      }, { signal: new AbortController().signal });

      // Normalize and verify response
      const normalizedItems = createSnapshotResult(result);
      expect(normalizedItems).toMatchSnapshot();
    });

    it("should handle non-existent parent", async () => {
      const result = await GetMediaTypeChildrenTool().handler({
        take: 100,
        parentId: BLANK_UUID
      }, { signal: new AbortController().signal });

      expect(result).toMatchSnapshot();
    });
  });

  describe("ancestors", () => {
    it("should get ancestor items", async () => {
      // Create folder structure
      const folderBuilder = await new MediaTypeFolderBuilder()
        .withName(TEST_FOLDER_NAME)
        .create();

      const childBuilder = await new MediaTypeBuilder()
        .withName(TEST_CHILD_NAME)
        .withParent(folderBuilder.getId())
        .create();

      const result = await GetMediaTypeAncestorsTool().handler({
        descendantId: childBuilder.getId()
      }, { signal: new AbortController().signal });

      // Normalize and verify response
      const normalizedItems = createSnapshotResult(result);
      expect(normalizedItems).toMatchSnapshot();
    });

    it("should handle non-existent item", async () => {
      const result = await GetMediaTypeAncestorsTool().handler({
        descendantId: BLANK_UUID
      }, { signal: new AbortController().signal });

      expect(result).toMatchSnapshot();
    });
  });
}); 