import CopyDocumentTypeTool from "../post/copy-document-type.js";
import { DocumentTypeBuilder } from "./helpers/document-type-builder.js";
import { DocumentTypeTestHelper } from "./helpers/document-type-test-helper.js";
import { DocumentTypeFolderBuilder } from "./helpers/document-type-folder-builder.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

const TEST_DOCTYPE_NAME = "_Test DocumentType Copy";
const TEST_DOCTYPE_COPY_NAME = "_Test DocumentType Copy (copy)";
const TEST_FOLDER_NAME = "_Test Folder For Copy";

describe("copy-document-type", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    // Clean up any test document types and folders
    await DocumentTypeTestHelper.cleanup(TEST_DOCTYPE_NAME);
    await DocumentTypeTestHelper.cleanup(TEST_DOCTYPE_COPY_NAME);
    await DocumentTypeTestHelper.cleanup(TEST_FOLDER_NAME);
  });

  it("should copy a document type to a folder", async () => {
    // Create a document type to copy
    const docTypeBuilder = await new DocumentTypeBuilder()
      .withName(TEST_DOCTYPE_NAME)
      .withIcon("icon-document")
      .create();

    // Create a target folder
    const folderBuilder = await new DocumentTypeFolderBuilder(TEST_FOLDER_NAME)
      .create();

    // Copy the document type
    const result = await CopyDocumentTypeTool().handler({
      id: docTypeBuilder.getId(),
      data: {
        target: {
          id: folderBuilder.getId()
        }
      }
    }, { signal: new AbortController().signal });

    // Normalize IDs in the response
    const normalizedResult = {
      ...result,
      content: result.content.map(content => {
        const parsed = JSON.parse(content.text as string);
        return {
          ...content,
          text: JSON.stringify(DocumentTypeTestHelper.normaliseIds(parsed))
        };
      })
    };

    // Verify the handler response using snapshot
    expect(normalizedResult).toMatchSnapshot();

    // Verify the document type was actually copied to the folder
    const copiedDocType = await DocumentTypeTestHelper.findDocumentType(TEST_DOCTYPE_COPY_NAME);
    expect(copiedDocType).toBeTruthy();
    expect(copiedDocType?.parent?.id).toBe(folderBuilder.getId());
  });

  it("should copy a document type to root", async () => {
    // Create a document type to copy
    const docTypeBuilder = await new DocumentTypeBuilder()
      .withName(TEST_DOCTYPE_NAME)
      .withIcon("icon-document")
      .create();

    // Copy the document type to root (no target)
    const result = await CopyDocumentTypeTool().handler({
      id: docTypeBuilder.getId(),
      data: {
        target: null
      }
    }, { signal: new AbortController().signal });

    // Normalize IDs in the response
    const normalizedResult = {
      ...result,
      content: result.content.map(content => {
        const parsed = JSON.parse(content.text as string);
        return {
          ...content,
          text: JSON.stringify(DocumentTypeTestHelper.normaliseIds(parsed))
        };
      })
    };

    // Verify the handler response using snapshot
    expect(normalizedResult).toMatchSnapshot();

    // Verify the document type was actually copied to root
    const copiedDocType = await DocumentTypeTestHelper.findDocumentType(TEST_DOCTYPE_COPY_NAME);
    expect(copiedDocType).toBeTruthy();
    expect(copiedDocType?.parent).toBeNull();
  });

  it("should handle non-existent document type", async () => {
    const result = await CopyDocumentTypeTool().handler({
      id: BLANK_UUID,
      data: {
        target: null
      }
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });

}); 