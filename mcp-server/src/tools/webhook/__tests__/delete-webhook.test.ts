import { WebhookTestHelper } from "./helpers/webhook-helper.js";
import DeleteWebhookTool from "../delete/delete-webhook.js";
import { createSnapshotResult } from "@/helpers/test-utils.js";
import { jest } from "@jest/globals";
import { WebhookBuilder } from "./helpers/webhook-builder.js";
import { BLANK_UUID } from "../../constants.js";
import { CONTENT_PUBLISHED_EVENT, TEST_WEBHOOOK_URL } from "./webhook-constants.js";

describe("delete-webhook", () => {
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

  it("should delete a webhook", async () => {
    // Create a webhook first
    const builder = await new WebhookBuilder()
      .withName(TEST_WEBHOOK_NAME)
      .withUrl(TEST_WEBHOOOK_URL)
      .withEvents([CONTENT_PUBLISHED_EVENT])
      .create();

    const result = await DeleteWebhookTool().handler({
      id: builder.getId()
    }, { signal: new AbortController().signal });

    // Normalize and verify response
    const normalizedItems = createSnapshotResult(result);
    expect(normalizedItems).toMatchSnapshot();

    // Verify the webhook was deleted
    const foundWebhook = await WebhookTestHelper.findWebhook(TEST_WEBHOOK_NAME);
    expect(foundWebhook).toBeNull();
  });

  it("should handle non-existent webhook", async () => {
    const result = await DeleteWebhookTool().handler({
      id: BLANK_UUID
    }, { signal: new AbortController().signal });

    expect(result).toMatchSnapshot();
  });
}); 