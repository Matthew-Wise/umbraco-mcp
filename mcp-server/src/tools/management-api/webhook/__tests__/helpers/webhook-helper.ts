import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { PagedWebhookResponseModel, WebhookResponseModel } from "@/umb-management-api/schemas/index.js";

export class WebhookTestHelper {
  static async findWebhook(nameOrUrl: string): Promise<WebhookResponseModel | null> {
    const client = UmbracoManagementClient.getClient();
    const response : PagedWebhookResponseModel = await client.getWebhook();
    
    return response.items.find((item: WebhookResponseModel) => 
      item.name === nameOrUrl || item.url === nameOrUrl
    ) || null;
  }

  static async verifyWebhook(id: string): Promise<boolean> {
    try {
      const client = UmbracoManagementClient.getClient();
      await client.getWebhookById(id);
      return true;
    } catch (error) {
      return false;
    }
  }

  static async cleanup(name: string): Promise<void> {
    try {
      const client = UmbracoManagementClient.getClient();
      const item = await this.findWebhook(name);
      if (item?.id) {
        await client.deleteWebhookById(item.id);
      }
    } catch (error) {
      console.error(`Error cleaning up webhook ${name}:`, error);
    }
  }
} 