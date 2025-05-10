import { WebhookTestHelper } from "./helpers/webhook-helper.js";
import CreateWebhookTool from "../post/create-webhook.js";
import { jest } from "@jest/globals";
import { WebhookBuilder } from "./helpers/webhook-builder.js";
import { CONTENT_PUBLISHED_EVENT, TEST_WEBHOOOK_URL } from "./webhook-constants.js";

describe("create-webhook", () => {
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

  it("should create a webhook", async () => {
    const builder = new WebhookBuilder()
      .withName(TEST_WEBHOOK_NAME)
      .withUrl(TEST_WEBHOOOK_URL)
      .withEvents([CONTENT_PUBLISHED_EVENT])

    const result = await CreateWebhookTool().handler(builder.build(), { signal: new AbortController().signal });

    // Normalize and verify response
    expect(result).toMatchSnapshot();

    const items = await WebhookTestHelper.findWebhook(TEST_WEBHOOK_NAME);
    expect(items).not.toBeNull();
    expect(items?.name).toBe(TEST_WEBHOOK_NAME);
    expect(items?.url).toBe(TEST_WEBHOOOK_URL);
  });

  it("should handle invalid webhook data", async () => {
    const invalidModel = {
      name: TEST_WEBHOOK_NAME,
      // Missing required URL field
    };

    const result = await CreateWebhookTool().handler(invalidModel as any, { signal: new AbortController().signal });

    expect(result).toMatchSnapshot();
  });

}); 