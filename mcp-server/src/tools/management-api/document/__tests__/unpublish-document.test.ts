import UnpublishDocumentTool from "../put/unpublish-document.js";
import PublishDocumentTool from "../put/publish-document.js";
import { DocumentBuilder } from "./helpers/document-builder.js";
import { DocumentTestHelper } from "./helpers/document-test-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

const TEST_DOCUMENT_NAME = "_Test UnpublishDocument";

describe("unpublish-document", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DocumentTestHelper.cleanup(TEST_DOCUMENT_NAME);
  });

  it("should unpublish a published document", async () => {
    const builder = await new DocumentBuilder()
      .withName(TEST_DOCUMENT_NAME)
      .withRootDocumentType()
      .create();
    await builder.publish();
    const item = builder.getCreatedItem();

    // Unpublish the document
    const result = await UnpublishDocumentTool().handler({
      id: item.id,
      data: { cultures: null }
    }, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();

    // Get the document back and check its published state
    const found = await DocumentTestHelper.findDocument(TEST_DOCUMENT_NAME);
    expect(found).toBeDefined();
    // Check if all variants are not published
    const isPublished = found?.variants.some((v: any) => v.state === "Published");
    expect(isPublished).toBe(false);
  });

  it("should handle unpublishing a non-existent document", async () => {
    const result = await UnpublishDocumentTool().handler({
      id: BLANK_UUID,
      data: { cultures: [] }
    }, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();
  });
}); 