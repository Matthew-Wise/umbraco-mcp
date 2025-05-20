import CreateDocumentTool from "../post/create-document.js";
import { DocumentTestHelper } from "./helpers/document-test-helper.js";
import { jest } from "@jest/globals";
import { ROOT_DOCUMENT_TYPE_ID } from "../../constants.js";

const TEST_DOCUMENT_NAME = "_Test Document Created";

describe("create-document", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DocumentTestHelper.cleanup(TEST_DOCUMENT_NAME);
  });

  it("should create a document", async () => {
    // Create document model
    const docModel = {
      documentTypeId: ROOT_DOCUMENT_TYPE_ID,
      name: TEST_DOCUMENT_NAME,
      values: []
    };

    // Create the document
    const result = await CreateDocumentTool().handler(docModel, {
      signal: new AbortController().signal
    });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the created item exists and matches expected values
    const item = await DocumentTestHelper.findDocument(TEST_DOCUMENT_NAME);
    expect(item).toBeDefined();
    const norm = { ...DocumentTestHelper.normaliseIds(item!), createDate: "<normalized>" };
    expect(norm).toMatchSnapshot();
  });

  it("should create a document with additional properties", async () => {
    // Create a more complex document with additional values
    const docModel = {
      documentTypeId: ROOT_DOCUMENT_TYPE_ID,
      name: TEST_DOCUMENT_NAME,
      values: [
        {
          editorAlias: "Umbraco.TextBox",
          culture: null,
          segment: null,
          alias: "title",
          value: "Test Value"
        }
      ]
    };

    const result = await CreateDocumentTool().handler(docModel, {
      signal: new AbortController().signal
    });

    expect(result).toMatchSnapshot();

    const item = await DocumentTestHelper.findDocument(TEST_DOCUMENT_NAME);
    expect(item).toBeDefined();
    const norm = { ...DocumentTestHelper.normaliseIds(item!), createDate: "<normalized>" };
    expect(norm).toMatchSnapshot();
  });
}); 