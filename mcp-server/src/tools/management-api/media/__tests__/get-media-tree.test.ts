import { MediaTestHelper } from "./helpers/media-test-helper.js";
import GetMediaAncestorsTool from "../items/get/get-ancestors.js";
import GetMediaChildrenTool from "../items/get/get-children.js";
import { createSnapshotResult } from "@/helpers/test-utils.js";
import { jest } from "@jest/globals";
import { MediaBuilder } from "./helpers/media-builder.js";
import { BLANK_UUID } from "../../constants.js";
import { TemporaryFileBuilder } from "../../temporary-file/__tests__/helpers/temporary-file-builder.js";

describe("media-tree", () => {
  const TEST_ROOT_NAME = "_Test Root Media";
  const TEST_CHILD_NAME = "_Test Child Media";
  let originalConsoleError: typeof console.error;
  let tempFileBuilder: TemporaryFileBuilder;

  beforeEach(async () => {
    originalConsoleError = console.error;
    console.error = jest.fn();

    tempFileBuilder = await new TemporaryFileBuilder()
    .withExampleFile()
    .create();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await MediaTestHelper.cleanup(TEST_ROOT_NAME);
    await MediaTestHelper.cleanup(TEST_CHILD_NAME);
  });

  describe("children", () => {
    it("should get child items", async () => {
      // Create parent media
      const parentBuilder = await new MediaBuilder()
        .withName(TEST_ROOT_NAME)
        .withFolderMediaType()
        .create();

      // Create child media
      await new MediaBuilder()
        .withName(TEST_CHILD_NAME)
        .withImageMediaType()
        .withImageValue(tempFileBuilder.getId())
        .withParent(parentBuilder.getId())
        .create();

      const result = await GetMediaChildrenTool().handler({
        take: 100,
        parentId: parentBuilder.getId()
      }, { signal: new AbortController().signal });

      const normalizedItems = createSnapshotResult(result);
      expect(normalizedItems).toMatchSnapshot();
    });

    it("should handle non-existent parent", async () => {
      const result = await GetMediaChildrenTool().handler({
        take: 100,
        parentId: BLANK_UUID
      }, { signal: new AbortController().signal });

      expect(result).toMatchSnapshot();
    });
  });

  describe("ancestors", () => {
    it("should get ancestor items", async () => {
      // Create parent media
      const parentBuilder = await new MediaBuilder()
        .withName(TEST_ROOT_NAME)
        .withFolderMediaType()
        .create();

      // Create child media
      const childBuilder = await new MediaBuilder()
        .withName(TEST_CHILD_NAME)
        .withImageMediaType()
        .withImageValue(tempFileBuilder.getId())
        .withParent(parentBuilder.getId())
        .create();

      const result = await GetMediaAncestorsTool().handler({
        descendantId: childBuilder.getId()
      }, { signal: new AbortController().signal });

      const normalizedItems = createSnapshotResult(result);
      expect(normalizedItems).toMatchSnapshot();
    });

    it("should handle non-existent item", async () => {
      const result = await GetMediaAncestorsTool().handler({
        descendantId: BLANK_UUID
      }, { signal: new AbortController().signal });

      expect(result).toMatchSnapshot();
    });
  });

}); 