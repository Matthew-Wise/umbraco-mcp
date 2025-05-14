import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateWebhookRequestModel } from "@/umb-management-api/schemas/index.js";
import { postWebhookBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { WebhookTestHelper } from "./webhook-helper.js";
import { z } from "zod";

export class WebhookBuilder {
  private model: Partial<CreateWebhookRequestModel> = {
    enabled: true,
    contentTypeKeys: [],
    headers: {},
    events: []
  };
  private id: string | null = null;

  withName(name: string): WebhookBuilder {
    this.model.name = name;
    return this;
  }

  withDescription(description: string): WebhookBuilder {
    this.model.description = description;
    return this;
  }

  withUrl(url: string): WebhookBuilder {
    this.model.url = url;
    return this;
  }

  withEnabled(enabled: boolean): WebhookBuilder {
    this.model.enabled = enabled;
    return this;
  }

  withContentTypeKeys(contentTypeKeys: string[]): WebhookBuilder {
    // Validate that all keys are valid UUIDs
    const uuidSchema = z.string().uuid();
    contentTypeKeys.forEach(key => {
      try {
        uuidSchema.parse(key);
      } catch (error) {
        throw new Error(`Invalid UUID in contentTypeKeys: ${key}`);
      }
    });
    this.model.contentTypeKeys = contentTypeKeys;
    return this;
  }

  withHeaders(headers: Record<string, string>): WebhookBuilder {
    this.model.headers = headers;
    return this;
  }

  withEvents(events: string[]): WebhookBuilder {
    this.model.events = events;
    return this;
  }

  async create(): Promise<WebhookBuilder> {
    if (!this.model.url) {
      throw new Error("URL is required");
    }

    const client = UmbracoManagementClient.getClient();
    const validatedModel = postWebhookBody.parse(this.model);

    // Create the webhook
    await client.postWebhook(validatedModel);

    // Find the created webhook by name or URL
    const name = this.model.name;
    const url = this.model.url;
    const createdItem = await WebhookTestHelper.findWebhook(name || url);
    if (!createdItem) {
      throw new Error(`Failed to find created webhook with name: ${name} or URL: ${url}`);
    }

    this.id = createdItem.id;
    return this;
  }

  async verify(): Promise<boolean> {
    if (!this.id) {
      throw new Error("No webhook has been created yet");
    }
    return WebhookTestHelper.verifyWebhook(this.id);
  }

  getId(): string {
    if (!this.id) {
      throw new Error("No webhook has been created yet");
    }
    return this.id;
  }

  build(): CreateWebhookRequestModel {
    return this.model as CreateWebhookRequestModel;
  }

  async cleanup(): Promise<void> {
    if (this.model.name) {
      await WebhookTestHelper.cleanup(this.model.name);
    }
  }
} 