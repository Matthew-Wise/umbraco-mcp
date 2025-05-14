import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getTreeDataTypeAncestorsQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetDataTypeAncestorsTool = CreateUmbracoTool(
  "get-data-type-ancestors",
  "Gets the ancestors of a data type by Id",
  getTreeDataTypeAncestorsQueryParams.shape,
  async (params) => {
    try {
      const client = UmbracoManagementClient.getClient();
      var response = await client.getTreeDataTypeAncestors(params);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting data type ancestors:", error);
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

export default GetDataTypeAncestorsTool; 