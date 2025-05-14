import PutDocumentNotificationsTool from "../put/put-document-notifications.js";
import { DocumentBuilder } from "./helpers/document-builder.js";
import { DocumentTestHelper } from "./helpers/document-test-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";
import GetDocumentNotificationsTool from "../get/get-document-notifications.js";

const TEST_DOCUMENT_NAME = "_Test PutNotificationsDocument";
const TEST_NOTIFICATION = "_TEST_ACTIONSAVE";

describe("put-document-notifications", () => {
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
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await DocumentTestHelper.cleanup(TEST_DOCUMENT_NAME);
  });

  it("should add a notification for a valid document", async () => {
    // Add notification
    const result = await PutDocumentNotificationsTool().handler({
      id: docId,
      data: { subscribedActionIds: [TEST_NOTIFICATION] }
    }, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();

    // Get notifications to verify
    const getResult = await GetDocumentNotificationsTool().handler({
      id: docId
    }, { signal: new AbortController().signal });
    expect(getResult).toMatchSnapshot();
  });

  it("should handle non-existent document", async () => {
    const result = await PutDocumentNotificationsTool().handler({
      id: BLANK_UUID,
      data: { subscribedActionIds: [TEST_NOTIFICATION] }
    }, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();
  });
}); 