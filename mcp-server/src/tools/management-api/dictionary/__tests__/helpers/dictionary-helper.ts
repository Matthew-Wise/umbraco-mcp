import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { getDictionaryByIdResponse, getDictionaryResponse } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { BLANK_UUID } from "../../../constants.js";

export const DEFAULT_ISO_CODE = "en-US";

export class DictionaryTestHelper {
  static async verifyDictionaryItem(id: string): Promise<boolean> {
    try {
      const client = UmbracoManagementClient.getClient();
      await client.getDictionaryById(id);
      return true;
    } catch (error) {
      return false;
    }
  }

  static async getDictionaryItem(id: string, forSnapshot: boolean = false) {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getDictionaryById(id);
    const output = getDictionaryByIdResponse.parse(response);
    if (forSnapshot) {
      output.id = BLANK_UUID;
    }
    return output;
  }

  static async findDictionaryItems(name: string, forSnapshot: boolean = false) {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getDictionary({ filter: name });
    const result = getDictionaryResponse.parse(response);
    return result.items.filter(item => item.name === name).map(item => {
      if (forSnapshot) {
        item.id = BLANK_UUID;
      }
      return item;
    });
  }

  static async cleanup(name: string): Promise<void> {
    try {
      const client = UmbracoManagementClient.getClient();
      const items = await this.findDictionaryItems(name);
      for (const item of items) {
        await client.deleteDictionaryById(item.id);
      }
    } catch (error) {
      console.error(`Error cleaning up dictionary item ${name}:`, error);
    }
  }

} 