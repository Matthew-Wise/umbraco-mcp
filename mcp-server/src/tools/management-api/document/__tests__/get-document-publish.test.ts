import GetDocumentPublishTool from "../get/get-document-publish.js";
import { DocumentBuilder } from "./helpers/document-builder.js";
import { DocumentTestHelper } from "./helpers/document-test-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";
import { createSnapshotResult } from "@/helpers/test-utils.js";

const TEST_DOCUMENT_NAME = "_Test GetDocumentPublish";

describe("get-document-publish", () => {
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DocumentTestHelper.cleanup(TEST_DOCUMENT_NAME);
  });

  it("should get the published state of a published document", async () => {
    const builder = await new DocumentBuilder()
      .withName(TEST_DOCUMENT_NAME)
      .withRootDocumentType()
      .create();
    await builder.publish();
    const item = builder.getCreatedItem();

    const result = await GetDocumentPublishTool().handler({
      id: item.id
    }, { signal: new AbortController().signal });
    const snapshot = createSnapshotResult(result, item.id);
    expect(snapshot).toMatchSnapshot();

    // Parse and check published state
    const parsed = JSON.parse(result.content[0].text as string);
    expect(parsed.variants.some((v: any) => v.state === "Published")).toBe(true);
  });

  it("should handle getting published state for a non-existent document", async () => {
    const result = await GetDocumentPublishTool().handler({
      id: BLANK_UUID
    }, { signal: new AbortController().signal });
    const snapshot = createSnapshotResult(result, BLANK_UUID);
    expect(snapshot).toMatchSnapshot();
  });
}); 