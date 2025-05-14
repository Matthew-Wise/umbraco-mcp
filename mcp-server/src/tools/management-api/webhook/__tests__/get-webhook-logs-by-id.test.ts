import GetWebhookLogsTool from "../get/get-webhook-logs-by-id.js";
import { jest } from "@jest/globals";
import { WebhookBuilder } from "./helpers/webhook-builder.js";
import { CONTENT_PUBLISHED_EVENT, TEST_WEBHOOOK_URL } from "./webhook-constants.js";

const TEST_WEBHOOK_NAME = "_Test Webhook Logs";

describe("get-webhook-logs", () => {
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
  });

  it("should get logs for a webhook", async () => {
    // Create a webhook first
    await builder
      .withName(TEST_WEBHOOK_NAME)
      .withUrl(TEST_WEBHOOOK_URL)
      .withEvents([CONTENT_PUBLISHED_EVENT])
      .create();

    const result = await GetWebhookLogsTool().handler({
      id: builder.getId()
    }, { signal: new AbortController().signal });

    expect(result).toMatchSnapshot();
  });
}); 