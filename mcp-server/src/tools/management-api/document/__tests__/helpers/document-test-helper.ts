import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import type { DocumentTreeItemResponseModel } from "../../../../api/umbraco/management/schemas/documentTreeItemResponseModel.js";
import type { DocumentVariantItemResponseModel } from "../../../../api/umbraco/management/schemas/documentVariantItemResponseModel.js";
import { BLANK_UUID } from "../../../constants.js";
import { DocumentRecycleBinItemResponseModel } from "@/umb-management-api/schemas/documentRecycleBinItemResponseModel.js";

export class DocumentTestHelper {
  private static findByName(items: DocumentTreeItemResponseModel[], name: string): DocumentTreeItemResponseModel | undefined {
    return items.find((item) =>
      Array.isArray(item.variants) && item.variants.some((variant: DocumentVariantItemResponseModel) => variant.name === name)
    );
  }

  static getNameFromItem(item?: DocumentTreeItemResponseModel): string {
    if (item && item.variants && item.variants.length > 0) {
      return item.variants[0].name;
    }
    return "";
  }

  static normaliseIds(items: DocumentTreeItemResponseModel | DocumentTreeItemResponseModel[]): DocumentTreeItemResponseModel | DocumentTreeItemResponseModel[] {
    if (Array.isArray(items)) {
      return items.map(item => ({ ...item, id: BLANK_UUID }));
    }
    return { ...items, id: BLANK_UUID };
  }

  static async cleanup(name: string): Promise<void> {
    try {
      const client = UmbracoManagementClient.getClient();
      const item = await this.findDocument(name);
      if (item) {
        try {
          await client.deleteDocumentById(item.id);
        } catch (deleteError) {
          console.log(`Error deleting document ${item.id}:`, deleteError);
        }
      }
    } catch (error) {
      console.log(`Error cleaning up document '${name}':`, error);
    }
  }

  static async findDocument(name: string): Promise<DocumentTreeItemResponseModel | undefined> {
    try {
      const client = UmbracoManagementClient.getClient();
      // First check root level
      const rootResponse = await client.getTreeDocumentRoot({});
      const rootMatch = this.findByName(rootResponse.items, name);
      if (rootMatch) {
        return rootMatch;
      }
      // Only check children if we haven't found the document
      for (const item of rootResponse.items) {
        if (item.hasChildren) {
          try {
            const childrenResponse = await client.getTreeDocumentChildren({ parentId: item.id });
            const childMatch = this.findByName(childrenResponse.items, name);
            if (childMatch) {
              return childMatch;
            }
          } catch (error) {
            console.log(`Error getting children for document ${item.id}:`, error);
          }
        }
      }
      return undefined;
    } catch (error) {
      console.log(`Error finding documents with name '${name}':`, error);
      return undefined;
    }
  }

  static async findDocumentInRecycleBin(name: string): Promise<DocumentRecycleBinItemResponseModel | undefined> {
    try {
      const client = UmbracoManagementClient.getClient();
      // Check recycle bin root level
      const recycleBinResponse = await client.getRecycleBinDocumentRoot({}); // -20 is the recycle bin ID
      const recycleBinMatch = this.findByName(recycleBinResponse.items, name);
      if (recycleBinMatch) {
        return recycleBinMatch;
      }
      // Only check children if we haven't found the document
      for (const item of recycleBinResponse.items) {
        if (item.hasChildren) {
          try {
            const childrenResponse = await client.getRecycleBinDocumentChildren({ parentId: item.id });
            const childMatch = this.findByName(childrenResponse.items, name);
            if (childMatch) {
              return childMatch;
            }
          } catch (error) {
            console.log(`Error getting children for document ${item.id}:`, error);
          }
        }
      }
      return undefined;
    } catch (error) {
      console.log(`Error finding documents with name '${name}' in recycle bin:`, error);
      return undefined;
    }
  }

  static async emptyRecycleBin(): Promise<void> {
    try {
      const client = UmbracoManagementClient.getClient();
      await client.deleteRecycleBinDocument();
    } catch (error) {
      console.log("Error emptying recycle bin:", error);
    }
  }

  static async getChildren(parentId: string, take: number = 10): Promise<DocumentTreeItemResponseModel[]> {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getTreeDocumentChildren({ parentId, take });
    return response.items;
  }
} 