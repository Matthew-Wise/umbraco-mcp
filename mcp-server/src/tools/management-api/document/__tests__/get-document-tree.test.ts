import { DocumentTestHelper } from "./helpers/document-test-helper.js";
import GetDocumentAncestorsTool from "../items/get/get-ancestors.js";
import GetDocumentChildrenTool from "../items/get/get-children.js";
import GetDocumentRootTool from "../items/get/get-root.js";
import { createSnapshotResult } from "@/helpers/test-utils.js";
import { jest } from "@jest/globals";
import { DocumentBuilder } from "./helpers/document-builder.js";
import { BLANK_UUID } from "../../constants.js";

describe("document-tree", () => {
  const TEST_ROOT_NAME = "_Test Root Document";
  const TEST_CHILD_NAME = "_Test Child Document";
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DocumentTestHelper.cleanup(TEST_ROOT_NAME);
    await DocumentTestHelper.cleanup(TEST_CHILD_NAME);
  });

  describe("children", () => {
    it("should get child items", async () => {
      // Create parent document
      const parentBuilder = await new DocumentBuilder()
        .withName(TEST_ROOT_NAME)
        .withRootDocumentType()
        .create();

      // Create child document
      await new DocumentBuilder()
        .withName(TEST_CHILD_NAME)
        .withContentDocumentType()
        .withParent(parentBuilder.getId())
        .create();

      const result = await GetDocumentChildrenTool().handler({
        take: 100,
        parentId: parentBuilder.getId()
      }, { signal: new AbortController().signal });

      const normalizedItems = createSnapshotResult(result);
      expect(normalizedItems).toMatchSnapshot();
    });

    it("should handle non-existent parent", async () => {
      const result = await GetDocumentChildrenTool().handler({
        take: 100,
        parentId: BLANK_UUID
      }, { signal: new AbortController().signal });

      expect(result).toMatchSnapshot();
    });
  });

  describe("ancestors", () => {
    it("should get ancestor items", async () => {
      // Create parent document
      const parentBuilder = await new DocumentBuilder()
        .withName(TEST_ROOT_NAME)
        .withRootDocumentType()
        .create();

      // Create child document
      const childBuilder = await new DocumentBuilder()
        .withName(TEST_CHILD_NAME)
        .withContentDocumentType()
        .withParent(parentBuilder.getId())
        .create();

      const result = await GetDocumentAncestorsTool().handler({
        descendantId: childBuilder.getId()
      }, { signal: new AbortController().signal });

      const normalizedItems = createSnapshotResult(result);
      expect(normalizedItems).toMatchSnapshot();
    });

    it("should handle non-existent item", async () => {
      const result = await GetDocumentAncestorsTool().handler({
        descendantId: BLANK_UUID
      }, { signal: new AbortController().signal });

      expect(result).toMatchSnapshot();
    });
  });
}); 