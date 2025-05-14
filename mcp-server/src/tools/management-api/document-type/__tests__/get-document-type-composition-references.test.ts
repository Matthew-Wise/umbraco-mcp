import GetDocumentTypeCompositionReferencesTool from "../get/get-document-type-composition-references.js";
import { DocumentTypeBuilder } from "./helpers/document-type-builder.js";
import { DocumentTypeTestHelper } from "./helpers/document-type-test-helper.js";
import { jest } from "@jest/globals";

const TEST_DOCTYPE_NAME = "_Test DocumentType Composition";
const TEST_COMPOSITION_NAME = "_Test Composition DocumentType";

describe("get-document-type-composition-references", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    // Clean up any test document types
    await DocumentTypeTestHelper.cleanup(TEST_DOCTYPE_NAME);
    await DocumentTypeTestHelper.cleanup(TEST_COMPOSITION_NAME);
  });

  it("should get composition references for a document type", async () => {
    // Create a document type to be used as a composition
    const compositionBuilder = await new DocumentTypeBuilder()
      .withName(TEST_COMPOSITION_NAME)
      .withIcon("icon-document")
      .create();


    // Get the composition references
    const result = await GetDocumentTypeCompositionReferencesTool().handler({
      id: compositionBuilder.getId()
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
  });

  it("should handle document type with no composition references", async () => {
    // Create a document type that isn't used as a composition
    const docTypeBuilder = await new DocumentTypeBuilder()
      .withName(TEST_DOCTYPE_NAME)
      .withIcon("icon-document")
      .create();

    // Get the composition references
    const result = await GetDocumentTypeCompositionReferencesTool().handler({
      id: docTypeBuilder.getId()
    }, { signal: new AbortController().signal });

    // Verify the handler response using snapshot
    expect(result).toMatchSnapshot();
  });
}); 