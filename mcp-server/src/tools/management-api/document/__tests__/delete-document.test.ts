import DeleteDocumentTool from "../delete/delete-document.js";
import { DocumentBuilder } from "./helpers/document-builder.js";
import { DocumentTestHelper } from "./helpers/document-test-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

const TEST_DOCUMENT_NAME = "_Test Document Delete";

describe("delete-document", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    // Clean up any remaining test documents
    await DocumentTestHelper.cleanup(TEST_DOCUMENT_NAME);
  });

  it("should delete a document", async () => {
    // Create a document to delete
    const builder = await new DocumentBuilder()
      .withName(TEST_DOCUMENT_NAME)
      .withRootDocumentType()
      .create();

    // Delete the document
    const result = await DeleteDocumentTool().handler({
      id: builder.getId()
    }, { signal: new AbortController().signal });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the document no longer exists
    const found = await DocumentTestHelper.findDocument(TEST_DOCUMENT_NAME);
    expect(found).toBeUndefined();
  });

  it("should handle non-existent document", async () => {
    const result = await DeleteDocumentTool().handler({
      id: BLANK_UUID
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });
}); 