import GetDocumentTypeTool from "../get/get-document-type-by-ids.js";
import { DocumentTypeBuilder } from "./helpers/document-type-builder.js";
import { DocumentTypeTestHelper } from "./helpers/document-type-test-helper.js";
import { BLANK_UUID } from "../../constants.js";
import { jest } from "@jest/globals";

describe("get-document-type", () => {
  const TEST_DOCTYPE_NAME = "_Test DocumentType Get";
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DocumentTypeTestHelper.cleanup(TEST_DOCTYPE_NAME);
  });

  it("should get a document type by id", async () => {
    // Create a document type to get
    const builder = await new DocumentTypeBuilder()
      .withName(TEST_DOCTYPE_NAME)
      .create();

    // Get the document type
    const result = await GetDocumentTypeTool().handler({
      id: builder.getId()
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
            id: BLANK_UUID,
            // Normalize any collection IDs if present
            collection: parsed.collection ? {
              ...parsed.collection,
              id: BLANK_UUID
            } : null,
            // Normalize IDs in properties array
            properties: (parsed.properties || []).map((prop: any) => ({
              ...prop,
              id: BLANK_UUID,
              container: prop.container ? { ...prop.container, id: BLANK_UUID } : null,
              dataType: { ...prop.dataType, id: BLANK_UUID }
            })),
            // Normalize IDs in containers array
            containers: (parsed.containers || []).map((container: any) => ({
              ...container,
              id: BLANK_UUID,
              parent: container.parent ? { ...container.parent, id: BLANK_UUID } : null
            })),
            // Normalize IDs in allowedTemplates array
            allowedTemplates: (parsed.allowedTemplates || []).map((template: any) => ({
              ...template,
              id: BLANK_UUID
            })),
            // Normalize ID in defaultTemplate if present
            defaultTemplate: parsed.defaultTemplate ? {
              ...parsed.defaultTemplate,
              id: BLANK_UUID
            } : null,
            // Normalize IDs in allowedDocumentTypes array
            allowedDocumentTypes: (parsed.allowedDocumentTypes || []).map((docType: any) => ({
              ...docType,
              documentType: { ...docType.documentType, id: BLANK_UUID }
            })),
            // Normalize IDs in compositions array
            compositions: (parsed.compositions || []).map((composition: any) => ({
              ...composition,
              documentType: { ...composition.documentType, id: BLANK_UUID }
            }))
          })
        };
      })
    };
    
    // Verify the handler response using snapshot
    expect(normalizedResult).toMatchSnapshot();
  });

  it("should handle non-existent document type", async () => {
    const result = await GetDocumentTypeTool().handler({
      id: BLANK_UUID
    }, { signal: new AbortController().signal });

    // Verify the error response using snapshot
    expect(result).toMatchSnapshot();
  });
}); 