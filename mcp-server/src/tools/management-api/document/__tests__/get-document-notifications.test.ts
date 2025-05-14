import GetDocumentNotificationsTool from "../get/get-document-notifications.js";
import PutDocumentNotificationsTool from "../put/put-document-notifications.js";
import { DocumentBuilder } from "./helpers/document-builder.js";
import { DocumentTestHelper } from "./helpers/document-test-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";

const TEST_DOCUMENT_NAME = "_Test NotificationsDocument";
const TEST_NOTIFICATION = "ACTIONSAVE";

describe("get-document-notifications", () => {
  let originalConsoleError: typeof console.error;
  let docId: string;

  beforeEach(async () => {
    originalConsoleError = console.error;
    console.error = jest.fn();
    // Create a document
    const builder = await new DocumentBuilder()
      .withName(TEST_DOCUMENT_NAME)
      .withRootDocumentType()
      .create();
    docId = builder.getId();
    // Add a notification
    await PutDocumentNotificationsTool().handler({
      id: docId,
      data: { subscribedActionIds: [TEST_NOTIFICATION] }
    }, { signal: new AbortController().signal });
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DocumentTestHelper.cleanup(TEST_DOCUMENT_NAME);
  });

  it("should add and then get notifications for a valid document", async () => {
    const result = await GetDocumentNotificationsTool().handler({
      id: docId
    }, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();
  });

  it("should handle non-existent document", async () => {
    const result = await GetDocumentNotificationsTool().handler({
      id: BLANK_UUID
    }, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();
  });
}); 