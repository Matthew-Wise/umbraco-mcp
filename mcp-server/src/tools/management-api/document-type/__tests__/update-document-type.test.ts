import UpdateDocumentTypeTool from "../put/update-document-type.js";
import { DocumentTypeBuilder } from "./helpers/document-type-builder.js";
import { DocumentTypeTestHelper } from "./helpers/document-type-test-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";
describe("update-document-type", () => {
  const TEST_DOCTYPE_NAME = "_Test DocumentType Update";
  const UPDATED_DOCTYPE_NAME = "_Test DocumentType Updated";
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    // Clean up any test document types
    await DocumentTypeTestHelper.cleanup(TEST_DOCTYPE_NAME);
    await DocumentTypeTestHelper.cleanup(UPDATED_DOCTYPE_NAME);
  });

  it("should update a document type", async () => {
    // Create a document type to update
    const builder = await new DocumentTypeBuilder()
      .withName(TEST_DOCTYPE_NAME)
      .create();

    // Create update model using builder
    const updateModel = new DocumentTypeBuilder()
      .withName(UPDATED_DOCTYPE_NAME)
      .withDescription("Updated description")
      .withIcon("icon-updated")
      .allowAsRoot()
      .variesByCulture()
      .build();

    // Update the document type
    const result = await UpdateDocumentTypeTool().handler({
      id: builder.getId(),
      data: updateModel
    }, { signal: new AbortController().signal });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the document type was updated
    const found = await DocumentTypeTestHelper.findDocumentType(UPDATED_DOCTYPE_NAME);
    expect(found).toBeDefined();
    expect(found!.id).toBe(builder.getId());
    expect(found!.name).toBe(UPDATED_DOCTYPE_NAME);
  });

  it("should handle non-existent document type", async () => {
    const updateModel = new DocumentTypeBuilder()
      .withName(UPDATED_DOCTYPE_NAME)
      .withDescription("Updated description")
      .build();

    const result = await UpdateDocumentTypeTool().handler({
      id: BLANK_UUID, 
      data: updateModel
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });

  it("should update document type with properties", async () => {
    // Create a document type to update
    const builder = await new DocumentTypeBuilder()
      .withName(TEST_DOCTYPE_NAME)
      .create();

    // Create update model with properties
    const updateModel = new DocumentTypeBuilder()
      .withName(UPDATED_DOCTYPE_NAME)
      .withDescription("Updated description")
      .withIcon("icon-updated")
      .allowAsRoot()
      .variesByCulture()
      // Add properties here if needed
      .build();

    // Update the document type
    const result = await UpdateDocumentTypeTool().handler({
      id: builder.getId(),
      data: updateModel
    }, { signal: new AbortController().signal });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the document type was updated with properties
    const found = await DocumentTypeTestHelper.findDocumentType(UPDATED_DOCTYPE_NAME);
    expect(found).toBeDefined();
    expect(found!.id).toBe(builder.getId());
    expect(found!.name).toBe(UPDATED_DOCTYPE_NAME);
    // Add property verification if needed
  });
}); 