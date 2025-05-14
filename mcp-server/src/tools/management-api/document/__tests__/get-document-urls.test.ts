import GetDocumentUrlsTool from "../get/get-document-urls.js";
import { DocumentBuilder } from "./helpers/document-builder.js";
import { DocumentTestHelper } from "./helpers/document-test-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

const TEST_DOCUMENT_NAME = "_Test GetDocumentUrls";
const TEST_PARENT_DOCUMENT_NAME = "_Test GetDocumentUrls Parent";
const TEST_CHILD_DOCUMENT_NAME = "_Test GetDocumentUrls Child";

describe("get-document-urls", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DocumentTestHelper.cleanup(TEST_DOCUMENT_NAME);
    await DocumentTestHelper.cleanup(TEST_PARENT_DOCUMENT_NAME);
    await DocumentTestHelper.cleanup(TEST_CHILD_DOCUMENT_NAME);
  });

  it("should get URLs for a valid document", async () => {
    const builder = await new DocumentBuilder()
      .withName(TEST_DOCUMENT_NAME)
      .withRootDocumentType()
      .create();
    await builder.publish();
    const item = builder.getCreatedItem();
    const result = await GetDocumentUrlsTool().handler({ id: [item.id] }, { signal: new AbortController().signal });
    const parsed = JSON.parse(result.content[0].text as string);
    expect(DocumentTestHelper.normaliseIds(parsed)).toMatchSnapshot();
  });

  it("should handle non-existent document id", async () => {
    const result = await GetDocumentUrlsTool().handler({ id: [BLANK_UUID] }, { signal: new AbortController().signal });
    const parsed = JSON.parse(result.content[0].text as string);
    expect(DocumentTestHelper.normaliseIds(parsed)).toMatchSnapshot();
  });

  it("should get URLs for a child document", async () => {
    // Create parent document
    const parentBuilder = await new DocumentBuilder()
      .withName(TEST_PARENT_DOCUMENT_NAME)
      .withRootDocumentType()
      .create();
    await parentBuilder.publish();
    // Create child document
    const childBuilder = await new DocumentBuilder()
      .withName(TEST_CHILD_DOCUMENT_NAME)
      .withContentDocumentType()
      .withParent(parentBuilder.getId())
      .create();
    await childBuilder.publish();
    const childItem = childBuilder.getCreatedItem();
    const result = await GetDocumentUrlsTool().handler({ id: [childItem.id] }, { signal: new AbortController().signal });
    const parsed = JSON.parse(result.content[0].text as string);
    expect(DocumentTestHelper.normaliseIds(parsed)).toMatchSnapshot();
  });
}); 