import UpdateDocumentTool from "../put/update-document.js";
import { DocumentBuilder } from "./helpers/document-builder.js";
import { DocumentTestHelper } from "./helpers/document-test-helper.js";
import { jest } from "@jest/globals";
import { ROOT_DOCUMENT_TYPE_ID, BLANK_UUID } from "../../constants.js";

describe("update-document", () => {
  const TEST_DOCUMENT_NAME = "_Test Document Update";
  const UPDATED_DOCUMENT_NAME = "_Test Document Updated";
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    // Clean up any test documents
    await DocumentTestHelper.cleanup(TEST_DOCUMENT_NAME);
    await DocumentTestHelper.cleanup(UPDATED_DOCUMENT_NAME);
  });

  it("should update a document", async () => {
    // Create a document to update
    const builder = await new DocumentBuilder()
      .withName(TEST_DOCUMENT_NAME)
      .withDocumentType(ROOT_DOCUMENT_TYPE_ID)
      .create();

    // Create update model using builder
    const updateModel = new DocumentBuilder()
      .withName(UPDATED_DOCUMENT_NAME)
      .withDocumentType(ROOT_DOCUMENT_TYPE_ID)
      .build();

    // Update the document
    const result = await UpdateDocumentTool().handler({
      id: builder.getId(),
      data: updateModel
    }, { signal: new AbortController().signal });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the document was updated
    const found = await DocumentTestHelper.findDocument(UPDATED_DOCUMENT_NAME);
    expect(found).toBeDefined();
    expect(found!.id).toBe(builder.getId());
    expect(DocumentTestHelper.getNameFromItem(found!)).toBe(UPDATED_DOCUMENT_NAME);
  });

  it("should handle non-existent document", async () => {
    const updateModel = new DocumentBuilder()
      .withName(UPDATED_DOCUMENT_NAME)
      .withDocumentType(ROOT_DOCUMENT_TYPE_ID)
      .build();

    const result = await UpdateDocumentTool().handler({
      id: BLANK_UUID,
      data: updateModel
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });

  it("should update document with properties", async () => {
    // Create a document to update
    const builder = await new DocumentBuilder()
      .withName(TEST_DOCUMENT_NAME)
      .withDocumentType(ROOT_DOCUMENT_TYPE_ID)
      .create();

    // Create update model with additional properties
    const updateModel = new DocumentBuilder()
      .withName(UPDATED_DOCUMENT_NAME)
      .withDocumentType(ROOT_DOCUMENT_TYPE_ID)
      .withValue("title", "Updated Title")
      .build();

    // Update the document
    const result = await UpdateDocumentTool().handler({
      id: builder.getId(),
      data: updateModel
    }, { signal: new AbortController().signal });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the document was updated with properties
    const found = await DocumentTestHelper.findDocument(UPDATED_DOCUMENT_NAME);
    expect(found).toBeDefined();
    expect(found!.id).toBe(builder.getId());
    expect(DocumentTestHelper.getNameFromItem(found!)).toBe(UPDATED_DOCUMENT_NAME);
    // Add property verification if needed
  });
}); 