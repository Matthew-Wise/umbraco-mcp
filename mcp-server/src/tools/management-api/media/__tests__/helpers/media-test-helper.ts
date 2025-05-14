import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import type { MediaTreeItemResponseModel } from "@/umb-management-api/schemas/mediaTreeItemResponseModel.js";
import { BLANK_UUID } from "../../../constants.js";
import { MediaRecycleBinItemResponseModel } from "@/umb-management-api/schemas/mediaRecycleBinItemResponseModel.js";
import { VariantItemResponseModel } from "@/umb-management-api/schemas/variantItemResponseModel.js";

export class MediaTestHelper {
  private static findByName(items: MediaTreeItemResponseModel[], name: string): MediaTreeItemResponseModel | undefined {
    return items.find((item) =>
      Array.isArray(item.variants) && item.variants.some((variant: VariantItemResponseModel) => variant.name === name)
    );
  }

  static getNameFromItem(item?: MediaTreeItemResponseModel): string {
    if (item && item.variants && item.variants.length > 0) {
      return item.variants[0].name;
    }
    return "";
  }

  static normaliseIds(items: MediaTreeItemResponseModel | MediaTreeItemResponseModel[]): MediaTreeItemResponseModel | MediaTreeItemResponseModel[] {
    if (Array.isArray(items)) {
      return items.map(item => ({ ...item, id: BLANK_UUID }));
    }
    return { ...items, id: BLANK_UUID };
  }

  static async cleanup(name: string): Promise<void> {
    try {
      const client = UmbracoManagementClient.getClient();
      const item = await this.findMedia(name);
      if (item) {
        try {
          await client.deleteMediaById(item.id);
        } catch (deleteError) {
          console.log(`Error deleting media ${item.id}:`, deleteError);
        }
      }
    } catch (error) {
      console.log(`Error cleaning up media '${name}':`, error);
    }
  }

  static async findMedia(name: string): Promise<MediaTreeItemResponseModel | undefined> {
    try {
      const client = UmbracoManagementClient.getClient();
      // First check root level
      const rootResponse = await client.getTreeMediaRoot({});
      const rootMatch = this.findByName(rootResponse.items, name);
      if (rootMatch) {
        return rootMatch;
      }
      // Only check children if we haven't found the media
      for (const item of rootResponse.items) {
        if (item.hasChildren) {
          try {
            const childrenResponse = await client.getTreeMediaChildren({ parentId: item.id });
            const childMatch = this.findByName(childrenResponse.items, name);
            if (childMatch) {
              return childMatch;
            }
          } catch (error) {
            console.log(`Error getting children for media ${item.id}:`, error);
          }
        }
      }
      return undefined;
    } catch (error) {
      console.log(`Error finding media with name '${name}':`, error);
      return undefined;
    }
  }

  static async findMediaInRecycleBin(name: string): Promise<MediaRecycleBinItemResponseModel | undefined> {
    try {
      const client = UmbracoManagementClient.getClient();
      // Check recycle bin root level
      const recycleBinResponse = await client.getRecycleBinMediaRoot({});
      const recycleBinMatch = this.findByName(recycleBinResponse.items as MediaTreeItemResponseModel[], name);
      if (recycleBinMatch) {
        return recycleBinMatch as MediaRecycleBinItemResponseModel;
      }
      // Only check children if we haven't found the media
      for (const item of recycleBinResponse.items) {
        if (item.hasChildren) {
          try {
            const childrenResponse = await client.getRecycleBinMediaChildren({ parentId: item.id });
            const childMatch = this.findByName(childrenResponse.items as MediaTreeItemResponseModel[], name);
            if (childMatch) {
              return childMatch as MediaRecycleBinItemResponseModel;
            }
          } catch (error) {
            console.log(`Error getting children for media ${item.id}:`, error);
          }
        }
      }
      return undefined;
    } catch (error) {
      console.log(`Error finding media with name '${name}' in recycle bin:`, error);
      return undefined;
    }
  }

  static async emptyRecycleBin(): Promise<void> {
    try {
      const client = UmbracoManagementClient.getClient();
      await client.deleteRecycleBinMedia();
    } catch (error) {
      console.log("Error emptying recycle bin:", error);
    }
  }

  static async getChildren(parentId: string, take: number = 10): Promise<MediaTreeItemResponseModel[]> {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getTreeMediaChildren({ parentId, take });
    return response.items;
  }

  static async restoreFromRecycleBin(name: string): Promise<void> {
    try {
      const client = UmbracoManagementClient.getClient();
      const item = await this.findMediaInRecycleBin(name);
      if (item) {
        await client.putRecycleBinMediaByIdRestore(item.id, { target: null });
      }
    } catch (error) {
      console.log(`Error restoring media '${name}' from recycle bin:`, error);
    }
  }
} 