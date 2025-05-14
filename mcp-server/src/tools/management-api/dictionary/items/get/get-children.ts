import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getTreeDictionaryChildrenQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetDictionaryChildrenTool = CreateUmbracoTool(
  "get-dictionary-children",
  "Gets the children of a dictionary item by Id",
  getTreeDictionaryChildrenQueryParams.shape,
  async (params) => {
    try {
      const client = UmbracoManagementClient.getClient();
      var response = await client.getTreeDictionaryChildren(params);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting dictionary children:", error);
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

export default GetDictionaryChildrenTool; 