import { WebhookBuilder } from "./webhook-builder.js";
import { BLANK_UUID } from "../../../constants.js";
import { jest } from "@jest/globals";
import { CONTENT_DELETED_EVENT, CONTENT_PUBLISHED_EVENT } from "../webhook-constants.js";

describe("webhook-builder", () => {
  const TEST_WEBHOOK_NAME = "_Test Webhook";
  const TEST_WEBHOOK_URL = "https://example.com/webhook";
  let builder: WebhookBuilder;

  beforeEach(() => {
    builder = new WebhookBuilder();
  });

  afterEach(async () => {
    await builder.cleanup();
  });

  it("should create a webhook with minimal required fields", async () => {
    const result = await builder
      .withName(TEST_WEBHOOK_NAME)
      .withUrl(TEST_WEBHOOK_URL)
      .withEvents([CONTENT_PUBLISHED_EVENT, CONTENT_DELETED_EVENT]) 
      .create();

    expect(result.getId()).toBeDefined();
    const verified = await result.verify();
    expect(verified).toBe(true);
  });

  it("should create a webhook with all fields", async () => {
    const result = await builder
      .withName(TEST_WEBHOOK_NAME)
      .withDescription("Test webhook description")
      .withUrl(TEST_WEBHOOK_URL)
      .withEnabled(true)
      .withContentTypeKeys([BLANK_UUID])
      .withHeaders({ "Authorization": "Bearer token" })
      .withEvents([CONTENT_PUBLISHED_EVENT, CONTENT_DELETED_EVENT])
      .create();

    expect(result.getId()).toBeDefined();
    const verified = await result.verify();
    expect(verified).toBe(true);
  });

  it("should throw error when creating webhook without URL", async () => {
    await expect(
      builder
        .withName(TEST_WEBHOOK_NAME)
        .create()
    ).rejects.toThrow("URL is required");
  });

  it("should build model without creating webhook", () => {
    const model = builder
      .withName(TEST_WEBHOOK_NAME)
      .withUrl(TEST_WEBHOOK_URL)
      .build();

    expect(model).toEqual({
      name: TEST_WEBHOOK_NAME,
      url: TEST_WEBHOOK_URL,
      enabled: true,
      contentTypeKeys: [],
      headers: {},
      events: []
    });
  });
}); 