import MoveDocumentTool from "../put/move-document.js";
import { DocumentBuilder } from "./helpers/document-builder.js";
import { DocumentTestHelper } from "./helpers/document-test-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

const TEST_DOCUMENT_SOURCE_NAME = "_Test Document Move";
const TEST_DOCUMENT_TARGET_NAME = "_Test Document Move Target";
const TEST_DOCUMENT_CONTENT_NAME = "_Test Document Content";

// Helper to get the moved document name
function getMovedName(name: string) {
  return name;
}

describe("move-document", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    // Clean up any test documents
    await DocumentTestHelper.cleanup(TEST_DOCUMENT_SOURCE_NAME);
    await DocumentTestHelper.cleanup(TEST_DOCUMENT_TARGET_NAME);
    await DocumentTestHelper.cleanup(TEST_DOCUMENT_CONTENT_NAME);
  });

  it("should move a document to another root document", async () => {
    // Create two root documents
    const rootSourceBuilder = await new DocumentBuilder()
    .withName(TEST_DOCUMENT_SOURCE_NAME)
    .withRootDocumentType()
    .create();

    const rootTargetBuilder = await new DocumentBuilder()
      .withName(TEST_DOCUMENT_TARGET_NAME)
      .withRootDocumentType()
      .create();

    const contentBuilder = await new DocumentBuilder()
      .withName(TEST_DOCUMENT_CONTENT_NAME)
      .withContentDocumentType()
      .withParent(rootSourceBuilder.getId())
      .create();

    // Move the document to be a child of the target
    const result = await MoveDocumentTool().handler({
      id: contentBuilder.getId(),
      data: {
        target: {
          id: rootTargetBuilder.getId()
        }
      }
    }, { signal: new AbortController().signal });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the document was moved
    const found = await DocumentTestHelper.findDocument(TEST_DOCUMENT_CONTENT_NAME);
    expect(found).toBeDefined();
    expect(found!.parent?.id).toBe(rootTargetBuilder.getId());
  });

  it("should handle moving to non-existent target", async () => {
    // Create a document to move
    const rootSourceBuilder = await new DocumentBuilder()
      .withName(TEST_DOCUMENT_SOURCE_NAME)
      .withRootDocumentType()
      .create();

    const contentBuilder = await new DocumentBuilder()
      .withName(TEST_DOCUMENT_CONTENT_NAME)
      .withContentDocumentType()
      .withParent(rootSourceBuilder.getId())
      .create();

    const result = await MoveDocumentTool().handler({
      id: rootSourceBuilder.getId(),
      data: {
        target: {
          id: BLANK_UUID
        }
      }
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });

  it("should handle moving non-existent document", async () => {
    const result = await MoveDocumentTool().handler({
      id: BLANK_UUID,
      data: {
        target: {
          id: BLANK_UUID
        }
      }
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });
}); 