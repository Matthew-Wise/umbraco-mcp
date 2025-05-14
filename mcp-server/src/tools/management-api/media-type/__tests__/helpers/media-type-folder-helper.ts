import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { getMediaTypeFolderByIdResponse } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { MediaTypeTreeItemResponseModel } from "@/umb-management-api/schemas/index.js";

export class MediaTypeFolderTestHelper {
  private static findByName(items: MediaTypeTreeItemResponseModel[], name: string): MediaTypeTreeItemResponseModel | undefined {
    return items.find(item => item.name === name && item.isFolder);
  }

  static async verifyFolder(id: string): Promise<boolean> {
    try {
      const client = UmbracoManagementClient.getClient();
      await client.getMediaTypeFolderById(id);
      return true;
    } catch (error) {
      return false;
    }
  }

  static async getFolder(id: string) {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getMediaTypeFolderById(id);
    return getMediaTypeFolderByIdResponse.parse(response);
  }

  static async findFolders(name: string): Promise<MediaTypeTreeItemResponseModel[]> {
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
            console.error(`Error getting children for media type folder ${item.id}:`, error);
          }
        }
      }

      return found;
    } catch (error) {
      console.error(`Error finding media type folder ${name}:`, error);
      return [];
    }
  }

  static async cleanup(name: string): Promise<void> {
    try {
      const client = UmbracoManagementClient.getClient();
      const items = await this.findFolders(name);
      for (const item of items) {
        await client.deleteMediaTypeFolderById(item.id);
      }
    } catch (error) {
      console.error(`Error cleaning up media type folder ${name}:`, error);
    }
  }
} 