import MoveDocumentToRecycleBinTool from "../put/move-to-recycle-bin.js";
import { DocumentBuilder } from "./helpers/document-builder.js";
import { DocumentTestHelper } from "./helpers/document-test-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

const TEST_DOCUMENT_NAME = "_Test Document RecycleBin";

describe("move-document-to-recycle-bin", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    // Clean up any test documents
    await DocumentTestHelper.emptyRecycleBin();
  });

  it("should move a document to the recycle bin", async () => {
    // Create a document
    const builder = await new DocumentBuilder()
      .withName(TEST_DOCUMENT_NAME)
      .withRootDocumentType()
      .create();

    // Move the document to the recycle bin
    const result = await MoveDocumentToRecycleBinTool().handler({
      id: builder.getId()
    }, { signal: new AbortController().signal });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the document is not found in the normal tree
    const foundNormal = await DocumentTestHelper.findDocument(TEST_DOCUMENT_NAME);
    expect(foundNormal).toBeUndefined();

    // Verify the document is found in the recycle bin
    const foundRecycleBin = await DocumentTestHelper.findDocumentInRecycleBin(TEST_DOCUMENT_NAME);
    expect(foundRecycleBin).toBeDefined();
  });

  it("should handle moving a non-existent document", async () => {
    const result = await MoveDocumentToRecycleBinTool().handler({
      id: BLANK_UUID
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });
}); 