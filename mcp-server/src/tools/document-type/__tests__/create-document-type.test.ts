import CreateDocumentTypeTool from "../post/create-document-type.js";
import { DocumentTypeTestHelper } from "./helpers/document-type-test-helper.js";
import { jest } from "@jest/globals";
import type { CreateDocumentTypeModel } from "../post/create-document-type.js";

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
    const docTypeModel: CreateDocumentTypeModel = {
      name: TEST_DOCTYPE_NAME,
      alias: TEST_DOCTYPE_NAME.toLowerCase().replace(/\s+/g, ''),
      icon: "icon-document",
      allowedAsRoot: false,
      compositions: [],
      allowedDocumentTypes: [],
      properties: []
    };

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
    const docTypeModel: CreateDocumentTypeModel = {
      name: EXISTING_DOCTYPE_NAME,
      alias: EXISTING_DOCTYPE_NAME.toLowerCase().replace(/\s+/g, ''),
      icon: "icon-document",
      allowedAsRoot: false,
      compositions: [],
      allowedDocumentTypes: [],
      properties: []
    };

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
    const docTypeModel: CreateDocumentTypeModel = {
      name: TEST_DOCTYPE_NAME,
      alias: TEST_DOCTYPE_NAME.toLowerCase().replace(/\s+/g, ''),
      icon: "icon-document",
      allowedAsRoot: false,
      compositions: [],
      allowedDocumentTypes: [],
      properties: [
        {
          name: "Property 1",
          alias: "property1",
          dataTypeId: "0cc0eba1-9960-42c9-bf9b-60e150b429ae",
          tab: "Tab 1",
          group: "Group 1"
        }
      ]
    };

    const result = await CreateDocumentTypeTool().handler(docTypeModel, { 
      signal: new AbortController().signal 
    });

    expect(result).toMatchSnapshot();

    const item = await DocumentTypeTestHelper.findDocumentType(TEST_DOCTYPE_NAME);
    expect(item).toBeDefined();
    expect(DocumentTypeTestHelper.normaliseIds(item!)).toMatchSnapshot();
  });

}); 