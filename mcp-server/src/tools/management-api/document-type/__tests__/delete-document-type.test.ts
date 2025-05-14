import DeleteDocumentTypeTool from "../delete/delete-document-type.js";
import { DocumentTypeBuilder } from "./helpers/document-type-builder.js";
import { DocumentTypeTestHelper } from "./helpers/document-type-test-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

describe("delete-document-type", () => {
  const TEST_DOCTYPE_NAME = "_Test DocumentType Delete";
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    // Clean up any remaining test document types
    await DocumentTypeTestHelper.cleanup(TEST_DOCTYPE_NAME);
  });

  it("should delete a document type", async () => {
    // Create a document type to delete
    const builder = await new DocumentTypeBuilder()
      .withName(TEST_DOCTYPE_NAME)
      .create();

    // Delete the document type
    const result = await DeleteDocumentTypeTool().handler({
      id: builder.getId()
    }, { signal: new AbortController().signal });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the document type no longer exists
    const found = await DocumentTypeTestHelper.findDocumentType(TEST_DOCTYPE_NAME);
    expect(found).toBeUndefined();
  });

  it("should handle non-existent document type", async () => {
    const result = await DeleteDocumentTypeTool().handler({
      id: BLANK_UUID
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });
}); 