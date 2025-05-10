import { WebhookTestHelper } from "./webhook-helper.js";
import { WebhookBuilder } from "./webhook-builder.js";
import { jest } from "@jest/globals";
import { CONTENT_PUBLISHED_EVENT } from "../webhook-constants.js";

describe("webhook-helper", () => {
  const TEST_WEBHOOK_NAME = "_Test Webhook";
  const TEST_WEBHOOK_URL = "https://example.com/webhook";
  let builder: WebhookBuilder;

  beforeEach(() => {
    builder = new WebhookBuilder();
  });

  afterEach(async () => {
    await builder.cleanup();
  });

  describe("findWebhook", () => {
    it("should find webhook by name", async () => {
      // Create a webhook first
      await builder
        .withName(TEST_WEBHOOK_NAME)
        .withUrl(TEST_WEBHOOK_URL)
        .withEvents([CONTENT_PUBLISHED_EVENT])
        .create();

      const foundWebhook = await WebhookTestHelper.findWebhook(TEST_WEBHOOK_NAME);
      expect(foundWebhook).not.toBeNull();
      expect(foundWebhook?.name).toBe(TEST_WEBHOOK_NAME);
    });

    it("should find webhook by URL", async () => {
      // Create a webhook first
      await builder
        .withName(TEST_WEBHOOK_NAME)
        .withUrl(TEST_WEBHOOK_URL)
        .withEvents([CONTENT_PUBLISHED_EVENT])
        .create();

      const foundWebhook = await WebhookTestHelper.findWebhook(TEST_WEBHOOK_URL);
      expect(foundWebhook).not.toBeNull();
      expect(foundWebhook?.url).toBe(TEST_WEBHOOK_URL);
    });

    it("should return null when webhook not found", async () => {
      const foundWebhook = await WebhookTestHelper.findWebhook("non-existent-webhook");
      expect(foundWebhook).toBeNull();
    });
  });

  describe("verifyWebhook", () => {
    it("should return true for existing webhook", async () => {
      // Create a webhook first
      const result = await builder
        .withName(TEST_WEBHOOK_NAME)
        .withUrl(TEST_WEBHOOK_URL)
        .withEvents([CONTENT_PUBLISHED_EVENT])
        .create();

      const verified = await WebhookTestHelper.verifyWebhook(result.getId());
      expect(verified).toBe(true);
    });

    it("should return false for non-existent webhook", async () => {
      const verified = await WebhookTestHelper.verifyWebhook("non-existent-id");
      expect(verified).toBe(false);
    });
  });

  describe("cleanup", () => {
    it("should delete existing webhook", async () => {
      // Create a webhook first
      const result = await builder
        .withName(TEST_WEBHOOK_NAME)
        .withUrl(TEST_WEBHOOK_URL)
        .withEvents([CONTENT_PUBLISHED_EVENT])
        .create();
;
      await WebhookTestHelper.cleanup(TEST_WEBHOOK_NAME);

      // Verify webhook is deleted
      const foundWebhook = await WebhookTestHelper.findWebhook(TEST_WEBHOOK_NAME);
      expect(foundWebhook).toBeNull();
    });

    it("should handle non-existent webhook deletion gracefully", async () => {
      // Attempt to delete a non-existent webhook
      await expect(WebhookTestHelper.cleanup("non-existent-id")).resolves.not.toThrow();
      
      // Verify no webhooks were affected
      const foundWebhook = await WebhookTestHelper.findWebhook(TEST_WEBHOOK_NAME);
      expect(foundWebhook).toBeNull();
    });
  });
}); 