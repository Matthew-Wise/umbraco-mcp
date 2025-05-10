import { WebhookTestHelper } from "./helpers/webhook-helper.js";
import GetWebhookByIdTool from "../get/get-webhook-by-id.js";
import { createSnapshotResult } from "@/helpers/test-utils.js";
import { jest } from "@jest/globals";
import { WebhookBuilder } from "./helpers/webhook-builder.js";
import { BLANK_UUID } from "../../constants.js";
import { CONTENT_DELETED_EVENT, CONTENT_PUBLISHED_EVENT, TEST_WEBHOOOK_URL } from "./webhook-constants.js";

describe("get-webhook-by-id", () => {
  const TEST_WEBHOOK_NAME = "_Test Webhook";
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await WebhookTestHelper.cleanup(TEST_WEBHOOK_NAME);
  });

  it("should get a webhook by id", async () => {
    // Create a webhook first
    const builder = await new WebhookBuilder()
      .withName(TEST_WEBHOOK_NAME)
      .withUrl(TEST_WEBHOOOK_URL)
      .withEvents([CONTENT_PUBLISHED_EVENT, CONTENT_DELETED_EVENT])
      .create();

    const result = await GetWebhookByIdTool().handler({
      id: builder.getId()
    }, { signal: new AbortController().signal });

    // Normalize and verify response
    const normalizedItems = createSnapshotResult(result);
    // Replace the dynamic ID with a placeholder
    const normalizedResponse = JSON.parse(normalizedItems.content[0].text);
    normalizedResponse.id = "PLACEHOLDER_ID";
    normalizedItems.content[0].text = JSON.stringify(normalizedResponse);
    expect(normalizedItems).toMatchSnapshot();
  });

  it("should handle non-existent webhook", async () => {
    const result = await GetWebhookByIdTool().handler({
      id: BLANK_UUID
    }, { signal: new AbortController().signal });

    expect(result).toMatchSnapshot();
  });
}); 