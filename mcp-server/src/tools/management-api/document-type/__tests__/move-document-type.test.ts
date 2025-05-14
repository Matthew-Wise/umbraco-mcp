import MoveDocumentTypeTool from "../put/move-document-type.js";
import { DocumentTypeBuilder } from "./helpers/document-type-builder.js";
import { DocumentTypeFolderBuilder } from "./helpers/document-type-folder-builder.js";
import { DocumentTypeTestHelper } from "./helpers/document-type-test-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

describe("move-document-type", () => {
  const TEST_DOCTYPE_NAME = "_Test DocumentType Move";
  const TEST_FOLDER_NAME = "_Test Folder";
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    // Clean up any test document types
    await DocumentTypeTestHelper.cleanup(TEST_DOCTYPE_NAME);
    await DocumentTypeTestHelper.cleanup(TEST_FOLDER_NAME);
  });

  it("should move a document type", async () => {
    // Create a folder
    const folderBuilder = await new DocumentTypeFolderBuilder(TEST_FOLDER_NAME)
      .create();

    // Create a document type to move
    const builder = await new DocumentTypeBuilder()
      .withName(TEST_DOCTYPE_NAME)
      .create();

    // Move the document type
    const result = await MoveDocumentTypeTool().handler({
      id: builder.getId(),
      data: {
        target: {
          id: folderBuilder.getId()
        }
      }
    }, { signal: new AbortController().signal });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();

    // Verify the document type was moved
    const found = await DocumentTypeTestHelper.findDocumentType(TEST_DOCTYPE_NAME);
    expect(found).toBeDefined();
    expect(found!.id).toBe(builder.getId());
  });

  it("should handle moving to non-existent folder", async () => {
    // Create a document type to move
    const builder = await new DocumentTypeBuilder()
      .withName(TEST_DOCTYPE_NAME)
      .create();

    const result = await MoveDocumentTypeTool().handler({
      id: builder.getId(),
      data: {
        target: {
          id: BLANK_UUID
        }
      }
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });

  it("should handle moving non-existent document type", async () => {
    const result = await MoveDocumentTypeTool().handler({
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