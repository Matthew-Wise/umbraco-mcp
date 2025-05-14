import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { getLanguageByIsoCodeResponse } from "@/umb-management-api/umbracoManagementAPI.zod.js";

export class LanguageTestHelper {
  static async verifyLanguage(isoCode: string): Promise<boolean> {
    try {
      const client = UmbracoManagementClient.getClient();
      await client.getLanguageByIsoCode(isoCode);
      return true;
    } catch (error) {
      return false;
    }
  }

  static async getLanguage(isoCode: string) {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getLanguageByIsoCode(isoCode);
    return getLanguageByIsoCodeResponse.parse(response);
  }

  static async cleanup(isoCode: string): Promise<void> {
    try {
      const client = UmbracoManagementClient.getClient();
      await client.deleteLanguageByIsoCode(isoCode);
    } catch (error) {
      console.error(`Error cleaning up language ${isoCode}:`, error);
    }
  }
} 