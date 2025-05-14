import CreateDocumentTypeTool from "../post/create-document-type.js";
import { DocumentTypeBuilder } from "./helpers/document-type-builder.js";
import { DocumentTypeTestHelper } from "./helpers/document-type-test-helper.js";
import { jest } from "@jest/globals";

const TEST_DOCTYPE_NAME = "_Test DocumentType Created";
const EXISTING_DOCTYPE_NAME = "_Existing DocumentType";

describe("create-document-type", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    // Clean up any test document types
    await DocumentTypeTestHelper.cleanup(TEST_DOCTYPE_NAME);
    await DocumentTypeTestHelper.cleanup(EXISTING_DOCTYPE_NAME);
  });

  it("should create a document type", async () => {
    // Create document type model using builder
    const docTypeModel = new DocumentTypeBuilder()
      .withName(TEST_DOCTYPE_NAME)
      .withIcon("icon-document")
      .allowAsRoot()
      .build();

    // Create the document type
    const result = await CreateDocumentTypeTool().handler(docTypeModel, { 
      signal: new AbortController().signal 
    });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the created item exists and matches expected values
    const item = await DocumentTypeTestHelper.findDocumentType(TEST_DOCTYPE_NAME);
    expect(item).toBeDefined();
    expect(DocumentTypeTestHelper.normaliseIds(item!)).toMatchSnapshot();
  });

  it("should handle existing document type", async () => {
    // Create document type model
    const docTypeModel = new DocumentTypeBuilder()
      .withName(EXISTING_DOCTYPE_NAME)
      .withIcon("icon-document")
      .build();

    // First create the document type
    await CreateDocumentTypeTool().handler(docTypeModel, { 
      signal: new AbortController().signal 
    });

    // Try to create it again
    const result = await CreateDocumentTypeTool().handler(docTypeModel, { 
      signal: new AbortController().signal 
    });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });

  it("should create a document type with properties", async () => {
    // Create a more complex document type with properties
    const docTypeModel = new DocumentTypeBuilder()
      .withName(TEST_DOCTYPE_NAME)
      .withIcon("icon-document")
      .withDescription("Test document type with properties")
      .variesByCulture()
      .allowAsRoot()
      // Add some test properties here if needed
      .build();

    const result = await CreateDocumentTypeTool().handler(docTypeModel, { 
      signal: new AbortController().signal 
    });

    expect(result).toMatchSnapshot();

    const item = await DocumentTypeTestHelper.findDocumentType(TEST_DOCTYPE_NAME);
    expect(item).toBeDefined();
    expect(DocumentTypeTestHelper.normaliseIds(item!)).toMatchSnapshot();
  });

}); 