import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { DataTypeTreeItemResponseModel } from "@/umb-management-api/schemas/dataTypeTreeItemResponseModel.js";
import { BLANK_UUID } from "../../../constants.js";

export class DataTypeTestHelper {
  private static findByName(items: DataTypeTreeItemResponseModel[], name: string): DataTypeTreeItemResponseModel | undefined {
    return items.find((item: any) => item.name === name);
  }

  static normaliseIds(items: DataTypeTreeItemResponseModel | DataTypeTreeItemResponseModel[]): DataTypeTreeItemResponseModel | DataTypeTreeItemResponseModel[] {
    if (Array.isArray(items)) {
      return items.map(item => ({ ...item, id: BLANK_UUID }));
    }
    return { ...items, id: BLANK_UUID };
  }

  static async cleanup(name: string): Promise<void> {
    try {
      const client = UmbracoManagementClient.getClient();
      const item = await this.findDataType(name);
      
      if (item) {
        try {
          if(item.isFolder) {
            await client.deleteDataTypeFolderById(item.id);
          } else {
            await client.deleteDataTypeById(item.id);
          }
        } catch (deleteError) {
          console.log(`Error deleting data type ${item.id}:`, deleteError);
        }
      }
    } catch (error) {
      console.log(`Error cleaning up data type '${name}':`, error);
    }
  }

  static async findDataType(name: string): Promise<DataTypeTreeItemResponseModel | undefined> {
    try {
      const client = UmbracoManagementClient.getClient();
      
      // First check root level
      const rootResponse = await client.getTreeDataTypeRoot({});
      const rootMatch = this.findByName(rootResponse.items, name);
      if (rootMatch) {
        return rootMatch;
      }

      // Only check children if we haven't found the data type
      for (const item of rootResponse.items) {
        if (item.hasChildren) {
          try {
            const childrenResponse = await client.getTreeDataTypeChildren({
              parentId: item.id
            });
            const childMatch = this.findByName(childrenResponse.items, name);
            if (childMatch) {
              return childMatch;
            }
          } catch (error) {
            console.log(`Error getting children for data type ${item.id}:`, error);
          }
        }
      }

      return undefined;
    } catch (error) {
      console.log(`Error finding data types with name '${name}':`, error);
      return undefined;
    }
  }
} 