import { UmbracoManagementClient } from "@umb-management-client";
import { DocumentTypeTreeItemResponseModel } from "@/umb-management-api/schemas/index.js";

export const BLANK_UUID = "00000000-0000-0000-0000-000000000000";

export class DocumentTypeTestHelper {
  static findByName(
    items: DocumentTypeTreeItemResponseModel[],
    name: string
  ): DocumentTypeTreeItemResponseModel | undefined {
    return items.find((item) => item.name === name);
  }

  static normaliseIds(
    items:
      | DocumentTypeTreeItemResponseModel
      | DocumentTypeTreeItemResponseModel[]
  ): DocumentTypeTreeItemResponseModel | DocumentTypeTreeItemResponseModel[] {
    if (Array.isArray(items)) {
      return items.map((item) => ({ ...item, id: BLANK_UUID }));
    }
    return { ...items, id: BLANK_UUID };
  }

  static async cleanup(name: string): Promise<void> {
    try {
      const item = await this.findDocumentType(name);
      if (item) {
        const client = UmbracoManagementClient.getClient();
        try {
          if (item.isFolder) {
            await client.deleteDocumentTypeFolderById(item.id);
          } else {
            await client.deleteDocumentTypeById(item.id);
          }
        } catch (deleteError) {
          console.error(
            `Error deleting document type ${item.id}:`,
            deleteError
          );
        }
      }
    } catch (error) {
      console.error(`Error cleaning up document type ${name}:`, error);
    }
  }

  static async findDocumentType(
    name: string
  ): Promise<DocumentTypeTreeItemResponseModel | undefined> {
    try {
      const client = UmbracoManagementClient.getClient();

      // First check root level
      const rootResponse = await client.getTreeDocumentTypeRoot({});
      const rootMatch = this.findByName(rootResponse.items, name);
      if (rootMatch) {
        return rootMatch;
      }

      // Recursively check children
      async function checkChildren(items: DocumentTypeTreeItemResponseModel[]): Promise<DocumentTypeTreeItemResponseModel | undefined> {
        for (const item of items) {
          if (item.hasChildren) {
            try {
              const childrenResponse = await client.getTreeDocumentTypeChildren({
                parentId: item.id,
              });
              
              // Check these children
              const childMatch = DocumentTypeTestHelper.findByName(childrenResponse.items, name);
              if (childMatch) {
                return childMatch;
              }

              // Recursively check their children
              const deeperMatch = await checkChildren(childrenResponse.items);
              if (deeperMatch) {
                return deeperMatch;
              }
            } catch (error) {
              console.error(
                `Error getting children for document type ${item.id}:`,
                error
              );
            }
          }
        }
        return undefined;
      }

      return await checkChildren(rootResponse.items);
    } catch (error) {
      console.error(`Error finding document type ${name}:`, error);
      return undefined;
    }
  }
}
