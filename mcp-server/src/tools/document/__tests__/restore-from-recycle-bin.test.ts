import RestoreFromRecycleBinTool from "../put/restore-from-recycle-bin.js";
import { DocumentBuilder } from "./helpers/document-builder.js";
import { DocumentTestHelper } from "./helpers/document-test-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

describe("restore-document-from-recycle-bin", () => {
  const TEST_DOCUMENT_NAME = "_Test Document Restore";
  let originalConsoleError: typeof console.error;

  beforeEach(async () => {
    originalConsoleError = console.error;
    console.error = jest.fn();

    await DocumentTestHelper.emptyRecycleBin();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    // Clean up any test documents
    await DocumentTestHelper.cleanup(TEST_DOCUMENT_NAME);
  });

  it("should restore a document from recycle bin", async () => {
    // Create a document and move it to recycle bin
    const builder = await new DocumentBuilder()
      .withName(TEST_DOCUMENT_NAME)
      .withRootDocumentType()
      .create();

    await builder.moveToRecycleBin();

    // Restore from recycle bin
    const result = await RestoreFromRecycleBinTool().handler({
      id: builder.getId()
    }, { signal: new AbortController().signal });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the document is back in the normal tree
    const found = await DocumentTestHelper.findDocument(TEST_DOCUMENT_NAME);
    expect(found).toBeDefined();
    expect(found!.variants[0].name).toBe(TEST_DOCUMENT_NAME);
  });

  it("should handle non-existent document", async () => {
    const result = await RestoreFromRecycleBinTool().handler({
      id: BLANK_UUID
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });
}); 