import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { GetTreeDataTypeRootParams } from "@/umb-management-api/schemas/index.js";
import { getTreeDataTypeRootQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetDataTypeRootTool = CreateUmbracoTool(
  "get-data-type-root",
  "Gets the root level of the data type and data type folders in the tree.",
  getTreeDataTypeRootQueryParams.shape,
  async (params: GetTreeDataTypeRootParams) => {
    try {
      const client = UmbracoManagementClient.getClient();
      var response = await client.getTreeDataTypeRoot(params);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting data type root:", error);
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${error}`,
          },
        ],
      };
    }
  }
);

export default GetDataTypeRootTool;
