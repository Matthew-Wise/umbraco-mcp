import GetWebhookItemTool from "../get/get-webhook-by-id-array.js";
import { WebhookBuilder } from "./helpers/webhook-builder.js";
import { WebhookTestHelper } from "./helpers/webhook-helper.js";
import { jest } from "@jest/globals";
import { BLANK_UUID } from "../../constants.js";
import { CONTENT_DELETED_EVENT, CONTENT_PUBLISHED_EVENT, TEST_WEBHOOOK_URL } from "./webhook-constants.js";

describe("get-webhook-item", () => {
  const TEST_WEBHOOK_NAME = "_Test Item Webhook";
  const TEST_WEBHOOK_NAME_2 = "_Test Item Webhook2";
  let originalConsoleError: typeof console.error;

  // Helper to parse response, handling empty string as empty array
  const parseItems = (text: string) => {
    if (!text || text.trim() === "") return [];
    return JSON.parse(text);
  };

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    console.error = originalConsoleError;
    await WebhookTestHelper.cleanup(TEST_WEBHOOK_NAME);
    await WebhookTestHelper.cleanup(TEST_WEBHOOK_NAME_2);
  });

  it("should get no webhooks for empty request", async () => {
    // Get all webhooks
    const result = await GetWebhookItemTool().handler({}, { signal: new AbortController().signal });
    const items = parseItems(result.content[0].text as string);

    expect(items).toMatchSnapshot();
  });

  it("should get single webhook by ID", async () => {
    // Create a webhook
    const builder = await new WebhookBuilder()
      .withName(TEST_WEBHOOK_NAME)
      .withUrl(TEST_WEBHOOOK_URL)
      .withEvents([CONTENT_PUBLISHED_EVENT])
      .create();

    // Get by ID
    const result = await GetWebhookItemTool().handler({ id: [builder.getId()] }, { signal: new AbortController().signal });
    const items = parseItems(result.content[0].text as string);
    expect(items).toHaveLength(1);
    expect(items[0].name).toBe(TEST_WEBHOOK_NAME);
    // Normalize for snapshot
    items[0].id = BLANK_UUID;
    expect(items).toMatchSnapshot();
  });

  it("should get multiple webhooks by ID", async () => {
    // Create first webhook
    const builder1 = await new WebhookBuilder()
      .withName(TEST_WEBHOOK_NAME)
      .withUrl("https://example.com/webhook1")
      .withEvents([CONTENT_PUBLISHED_EVENT])
      .create();

    // Create second webhook
    const builder2 = await new WebhookBuilder()
      .withName(TEST_WEBHOOK_NAME_2)
      .withUrl("https://example.com/webhook2")
      .withEvents([CONTENT_DELETED_EVENT])
      .create();

    // Get by IDs
    const result = await GetWebhookItemTool().handler({ 
      id: [builder1.getId(), builder2.getId()]
    }, { signal: new AbortController().signal });
    
    const items = parseItems(result.content[0].text as string);
    expect(items).toHaveLength(2);
    expect(items[0].name).toBe(TEST_WEBHOOK_NAME);
    expect(items[1].name).toBe(TEST_WEBHOOK_NAME_2);
    
    // Normalize for snapshot
    items.forEach((item: any) => {
      item.id = BLANK_UUID;
    });
    expect(items).toMatchSnapshot();
  });
}); 