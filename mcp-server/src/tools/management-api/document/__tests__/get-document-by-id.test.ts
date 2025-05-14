import { ROOT_DOCUMENT_TYPE_ID } from "../../constants.js";
import GetDocumentByIdTool from "../get/get-document-by-id.js";
import { DocumentBuilder } from "./helpers/document-builder.js";
import { DocumentTestHelper } from "./helpers/document-test-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

const TEST_DOCUMENT_NAME = "_Test GetDocumentById";

describe("get-document-by-id", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DocumentTestHelper.cleanup(TEST_DOCUMENT_NAME);
  });

  it("should get a document by ID", async () => {
    // Create a document
    const builder = await new DocumentBuilder()
      .withName(TEST_DOCUMENT_NAME)
      .withDocumentType(ROOT_DOCUMENT_TYPE_ID)
      .create();
    const id = builder.getId();
    // Get by ID
    const result = await GetDocumentByIdTool().handler({ id }, { signal: new AbortController().signal });
    const doc = JSON.parse(result.content[0].text as string);
    expect(doc.id).toBe(id);
    expect(doc.variants[0].name).toBe(TEST_DOCUMENT_NAME);
  });

  it("should return error for non-existent ID", async () => {
    const result = await GetDocumentByIdTool().handler({ id: BLANK_UUID }, { signal: new AbortController().signal });
    expect(result.content[0].text).toMatch(/error/i);
  });
}); 