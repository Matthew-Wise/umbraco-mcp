import { UmbracoManagementClient } from "@umb-management-client";
import { DataTypeTreeItemResponseModel } from "@/umb-management-api/schemas/dataTypeTreeItemResponseModel.js";

export const BLANK_UUID = "00000000-0000-0000-0000-000000000000";

export class DataTypeTestHelper {
  static findByName(
    items: DataTypeTreeItemResponseModel[],
    name: string
  ): DataTypeTreeItemResponseModel | undefined {
    return items.find((item) => item.name === name);
  }

  static normaliseIds(
    items:
      | DataTypeTreeItemResponseModel
      | DataTypeTreeItemResponseModel[]
  ): DataTypeTreeItemResponseModel | DataTypeTreeItemResponseModel[] {
    if (Array.isArray(items)) {
      return items.map((item) => ({ ...item, id: BLANK_UUID }));
    }
    return { ...items, id: BLANK_UUID };
  }

  static async cleanup(name: string): Promise<void> {
    try {
      const item = await this.findDataType(name);
      if (item) {
        const client = UmbracoManagementClient.getClient();
        try {
          if (item.isFolder) {
            await client.deleteDataTypeFolderById(item.id);
          } else {
            await client.deleteDataTypeById(item.id);
          }
        } catch (deleteError) {
          console.error(
            `Error deleting data type ${item.id}:`,
            deleteError
          );
        }
      }
    } catch (error) {
      console.error(`Error cleaning up data type ${name}:`, error);
    }
  }

  static async findDataType(
    name: string
  ): Promise<DataTypeTreeItemResponseModel | undefined> {
    try {
      const client = UmbracoManagementClient.getClient();

      // First check root level
      const rootResponse = await client.getTreeDataTypeRoot({});
      const rootMatch = this.findByName(rootResponse.items, name);
      if (rootMatch) {
        return rootMatch;
      }

      // Recursively check children
      async function checkChildren(items: DataTypeTreeItemResponseModel[]): Promise<DataTypeTreeItemResponseModel | undefined> {
        for (const item of items) {
          if (item.hasChildren) {
            try {
              const childrenResponse = await client.getTreeDataTypeChildren({
                parentId: item.id,
              });
              
              // Check these children
              const childMatch = DataTypeTestHelper.findByName(childrenResponse.items, name);
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
                `Error getting children for data type ${item.id}:`,
                error
              );
            }
          }
        }
        return undefined;
      }

      return await checkChildren(rootResponse.items);
    } catch (error) {
      console.error(`Error finding data type ${name}:`, error);
      return undefined;
    }
  }
}
