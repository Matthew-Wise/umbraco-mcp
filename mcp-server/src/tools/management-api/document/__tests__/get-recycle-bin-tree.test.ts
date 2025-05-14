import { DocumentTestHelper } from "./helpers/document-test-helper.js";
import GetRecycleBinDocumentRootTool from "../items/get/get-recycle-bin-root.js";
import GetRecycleBinDocumentChildrenTool from "../items/get/get-recycle-bin-children.js";
import { createSnapshotResult } from "@/helpers/test-utils.js";
import { jest } from "@jest/globals";
import { DocumentBuilder } from "./helpers/document-builder.js";
import { BLANK_UUID } from "../../constants.js";

describe("recycle-bin-tree", () => {
  const TEST_RECYCLE_BIN_NAME = "_Test RecycleBin Root";
  const TEST_RECYCLE_BIN_CHILD_NAME = "_Test RecycleBin Child";
  let originalConsoleError: typeof console.error;

  beforeEach(async () => {
    originalConsoleError = console.error;
    console.error = jest.fn();
    await DocumentTestHelper.emptyRecycleBin();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DocumentTestHelper.emptyRecycleBin();
  });

  describe("root", () => {
    it("should get recycle bin root items", async () => {
      // Create and move a document to the recycle bin
      const builder = await new DocumentBuilder()
        .withName(TEST_RECYCLE_BIN_NAME)
        .withRootDocumentType()
        .create();
      await builder.moveToRecycleBin();

      const result = await GetRecycleBinDocumentRootTool().handler({ take: 100 }, { signal: new AbortController().signal });
      const normalizedItems = createSnapshotResult(result);
      expect(normalizedItems).toMatchSnapshot();
    });
  });

  describe("children", () => {
    it("should get recycle bin child items", async () => {
      // Create parent and child, move both to recycle bin
      const parentBuilder = await new DocumentBuilder()
        .withName(TEST_RECYCLE_BIN_NAME)
        .withRootDocumentType()
        .create();
      const childBuilder = await new DocumentBuilder()
        .withName(TEST_RECYCLE_BIN_CHILD_NAME)
        .withContentDocumentType()
        .withParent(parentBuilder.getId())
        .create();
      await childBuilder.moveToRecycleBin();
      await parentBuilder.moveToRecycleBin();

      // Find parent in recycle bin to get its id
      const parentInBin = await DocumentTestHelper.findDocumentInRecycleBin(TEST_RECYCLE_BIN_NAME);
      expect(parentInBin).toBeDefined();

      const result = await GetRecycleBinDocumentChildrenTool().handler({
        take: 100,
        parentId: parentInBin!.id
      }, { signal: new AbortController().signal });
      const normalizedItems = createSnapshotResult(result);
      expect(normalizedItems).toMatchSnapshot();
    });

    it("should handle non-existent parent in recycle bin", async () => {
      const result = await GetRecycleBinDocumentChildrenTool().handler({
        take: 100,
        parentId: BLANK_UUID
      }, { signal: new AbortController().signal });
      expect(result).toMatchSnapshot();
    });
  });
}); 