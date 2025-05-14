import CopyDocumentTool from "../post/copy-document.js";
import { DocumentBuilder } from "./helpers/document-builder.js";
import { DocumentTestHelper } from "./helpers/document-test-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

const TEST_DOCUMENT_NAME = "_Test Document Copy";
const TEST_DOCUMENT_COPY_NAME = "_Test Document Copy (1)";

// Helper to get the copied document name (Umbraco appends ' (copy)' by default)
function getCopyName(name: string) {
  return `${name} (copy)`;
}

describe("copy-document", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    // Clean up any test documents
    await DocumentTestHelper.cleanup(TEST_DOCUMENT_NAME);
    await DocumentTestHelper.cleanup(TEST_DOCUMENT_COPY_NAME);
  });

  it("should copy a document to root", async () => {
    // Create a document to copy
    const docBuilder = await new DocumentBuilder()
      .withName(TEST_DOCUMENT_NAME)
      .withRootDocumentType()
      .create();

    // Copy the document to root (no target)
    const result = await CopyDocumentTool().handler({
      id: docBuilder.getId(),
      data: {
        target: null,
        relateToOriginal: false,
        includeDescendants: false
      }
    }, { signal: new AbortController().signal });

    // Normalize IDs in the response
    const normalizedResult = {
      ...result,
      content: result.content.map(content => {
        const parsed = JSON.parse(content.text as string);
        return {
          ...content,
          text: JSON.stringify(DocumentTestHelper.normaliseIds(parsed))
        };
      })
    };

    // Verify the handler response using snapshot
    expect(normalizedResult).toMatchSnapshot();

    // Verify the document was actually copied to root
    const copiedDoc = await DocumentTestHelper.findDocument(TEST_DOCUMENT_COPY_NAME);
    expect(copiedDoc).toBeTruthy();
    expect(copiedDoc?.parent).toBeNull();
  });

  it("should handle non-existent document", async () => {
    const result = await CopyDocumentTool().handler({
      id: BLANK_UUID,
      data: {
        target: null,
        relateToOriginal: false,
        includeDescendants: false
      }
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });
}); 