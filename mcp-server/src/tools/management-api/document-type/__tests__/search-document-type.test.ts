import SearchDocumentTypeTool from "../get/search-document-type.js";
import { DocumentTypeBuilder } from "./helpers/document-type-builder.js";
import { DocumentTypeTestHelper } from "./helpers/document-type-test-helper.js";
import { jest } from "@jest/globals";

const TEST_DOCTYPE_NAME = "_Test DocumentType Search";
const TEST_DOCTYPE_NAME_2 = "_Test DocumentType Search 2";

describe("search-document-type", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    // Clean up any test document types
    await DocumentTypeTestHelper.cleanup(TEST_DOCTYPE_NAME);
    await DocumentTypeTestHelper.cleanup(TEST_DOCTYPE_NAME_2);
  });

  it("should search for document types", async () => {
    // Create test document types
    await new DocumentTypeBuilder()
      .withName(TEST_DOCTYPE_NAME)
      .withIcon("icon-document")
      .create();

    await new DocumentTypeBuilder()
      .withName(TEST_DOCTYPE_NAME_2)
      .withIcon("icon-document")
      .create();

    // Search for document types
    const result = await SearchDocumentTypeTool().handler({
      query: TEST_DOCTYPE_NAME,
      skip: 0,
      take: 10
    }, { signal: new AbortController().signal });

    // Normalize IDs in the response
    const normalizedResult = {
      ...result,
      content: result.content.map(content => {
        const parsed = JSON.parse(content.text as string);
        return {
          ...content,
          text: JSON.stringify({
            ...parsed,
            items: DocumentTypeTestHelper.normaliseIds(parsed.items)
          })
        };
      })
    };

    // Verify the handler response using snapshot
    expect(normalizedResult).toMatchSnapshot();
  });

  it("should handle empty search results", async () => {
    const result = await SearchDocumentTypeTool().handler({
      query: "NonExistentDocumentType",
      skip: 0,
      take: 10
    }, { signal: new AbortController().signal });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();
  });

  it("should handle pagination", async () => {
    // Create test document types
    await new DocumentTypeBuilder()
      .withName(TEST_DOCTYPE_NAME)
      .withIcon("icon-document")
      .create();

    await new DocumentTypeBuilder()
      .withName(TEST_DOCTYPE_NAME_2)
      .withIcon("icon-document")
      .create();

    // Search with pagination
    const result = await SearchDocumentTypeTool().handler({
      query: TEST_DOCTYPE_NAME,
      skip: 1,
      take: 1
    }, { signal: new AbortController().signal });

    // Normalize IDs in the response
    const normalizedResult = {
      ...result,
      content: result.content.map(content => {
        const parsed = JSON.parse(content.text as string);
        return {
          ...content,
          text: JSON.stringify({
            ...parsed,
            items: DocumentTypeTestHelper.normaliseIds(parsed.items)
          })
        };
      })
    };

    // Verify the handler response using snapshot
    expect(normalizedResult).toMatchSnapshot();
  });
}); 