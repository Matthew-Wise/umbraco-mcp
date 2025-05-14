import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { TemporaryFileResponseModel } from "@/umb-management-api/schemas/index.js";

export class TemporaryFileTestHelper {
  static async findTemporaryFiles(id: string): Promise<TemporaryFileResponseModel[]> {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getTemporaryFileById(id);
      return [response];
    } catch (error) {
      return [];
    }
  }

  static async cleanup(id: string): Promise<void> {
    try {
      const client = UmbracoManagementClient.getClient();
      await client.deleteTemporaryFileById(id);
    } catch (error) {
      // Ignore errors during cleanup
    }
  }
} 