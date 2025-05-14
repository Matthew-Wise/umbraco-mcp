import { WebhookTestHelper } from "./helpers/webhook-helper.js";
import UpdateWebhookTool from "../put/update-webhook.js";
import { createSnapshotResult } from "@/helpers/test-utils.js";
import { jest } from "@jest/globals";
import { WebhookBuilder } from "./helpers/webhook-builder.js";
import { BLANK_UUID } from "../../constants.js";
import { CONTENT_PUBLISHED_EVENT, CONTENT_UNPUBLISHED_EVENT, TEST_WEBHOOOK_URL } from "./webhook-constants.js";

const TEST_WEBHOOK_NAME = "_Test Webhook Update";
const UPDATED_WEBHOOK_NAME = "_Updated Webhook";
const NON_EXISTENT_WEBHOOK_NAME = "_Non Existent Webhook";

describe("update-webhook", () => {
  let originalConsoleError: typeof console.error;
  let builder: WebhookBuilder;

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
    builder = new WebhookBuilder();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await builder.cleanup();
    await WebhookTestHelper.cleanup(UPDATED_WEBHOOK_NAME);
  });

  it("should update a webhook", async () => {
    await builder
      .withName(TEST_WEBHOOK_NAME)
      .withUrl(TEST_WEBHOOOK_URL)
      .withEvents([CONTENT_PUBLISHED_EVENT])
      .create();

    const model = builder
      .withName(UPDATED_WEBHOOK_NAME)
      .withUrl("https://example.com/updated-webhook")
      .withEvents([CONTENT_UNPUBLISHED_EVENT])
      .build();

    const result = await UpdateWebhookTool().handler({
      id: builder.getId(),
      data: model
    }, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();

    // Verify the webhook was updated
    const foundWebhook = await WebhookTestHelper.findWebhook(UPDATED_WEBHOOK_NAME);
    expect(foundWebhook).not.toBeNull();
    expect(foundWebhook?.url).toBe("https://example.com/updated-webhook");
    expect(foundWebhook?.events).toEqual([{
        "alias": CONTENT_UNPUBLISHED_EVENT,
        "eventName": CONTENT_UNPUBLISHED_EVENT,
        "eventType": "Other",
    }]);
  });

  it("should handle non-existent webhook", async () => {
    const model = builder
      .withName(NON_EXISTENT_WEBHOOK_NAME)
      .withUrl("https://example.com/webhook")
      .withEvents([CONTENT_PUBLISHED_EVENT])
      .build();

    const result = await UpdateWebhookTool().handler({
      id: BLANK_UUID,
      data: model
    }, { signal: new AbortController().signal });
    expect(result).toMatchSnapshot();
  });
}); 