import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { getMediaTypeByIdResponse } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { MediaTypeTreeItemResponseModel } from "@/umb-management-api/schemas/index.js";

export class MediaTypeTestHelper {
  private static findByName(items: MediaTypeTreeItemResponseModel[], name: string): MediaTypeTreeItemResponseModel | undefined {
    return items.find(item => item.name === name);
  }

  static async verifyMediaType(id: string): Promise<boolean> {
    try {
      const client = UmbracoManagementClient.getClient();
      await client.getMediaTypeById(id);
      return true;
    } catch (error) {
      return false;
    }
  }

  static async getMediaType(id: string) {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getMediaTypeById(id);
    return getMediaTypeByIdResponse.parse(response);
  }

  static async findMediaTypes(name: string): Promise<MediaTypeTreeItemResponseModel[]> {
    try {
      const client = UmbracoManagementClient.getClient();
      const found: MediaTypeTreeItemResponseModel[] = [];
      
      // First check root level
      const rootResponse = await client.getTreeMediaTypeRoot({});
      const rootMatch = this.findByName(rootResponse.items, name);
      if (rootMatch) {
        found.push(rootMatch);
      }

      // Check children of root items
      for (const item of rootResponse.items) {
        if (item.hasChildren) {
          try {
            const childrenResponse = await client.getTreeMediaTypeChildren({
              parentId: item.id
            });
            const childMatch = this.findByName(childrenResponse.items, name);
            if (childMatch) {
              found.push(childMatch);
            }
          } catch (error) {
            console.error(`Error getting children for media type ${item.id}:`, error);
          }
        }
      }

      return found;
    } catch (error) {
      console.error(`Error finding media type ${name}:`, error);
      return [];
    }
  }

  static async cleanup(name: string): Promise<void> {
    try {
      const client = UmbracoManagementClient.getClient();
      const items = await this.findMediaTypes(name);
      for (const item of items) {
        await client.deleteMediaTypeById(item.id);
      }
    } catch (error) {
      console.error(`Error cleaning up media type ${name}:`, error);
    }
  }
} 