import PublishDocumentTool from "../put/publish-document.js";
import { DocumentBuilder } from "./helpers/document-builder.js";
import { DocumentTestHelper } from "./helpers/document-test-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

const TEST_DOCUMENT_NAME = "_Test PublishDocument";

describe("publish-document", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DocumentTestHelper.cleanup(TEST_DOCUMENT_NAME);
  });

  it("should publish a valid document", async () => {
    const builder = await new DocumentBuilder()
      .withName(TEST_DOCUMENT_NAME)
      .withRootDocumentType()
      .create();
    const item = builder.getCreatedItem();

    const result = await PublishDocumentTool().handler({
      id: item.id,
      data: { publishSchedules: [{culture: null}] }
    }, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();

    // Get the document back and check its published state
    const found = await DocumentTestHelper.findDocument(TEST_DOCUMENT_NAME);
    expect(found).toBeDefined();
    // Check if any variant is published
    const isPublished = found?.variants.some((v: any) => v.state === "Published");
    expect(isPublished).toBe(true);
  });

  it("should handle publishing a non-existent document", async () => {
    const result = await PublishDocumentTool().handler({
      id: BLANK_UUID,
      data: { publishSchedules: [] }
    }, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();
  });
}); 