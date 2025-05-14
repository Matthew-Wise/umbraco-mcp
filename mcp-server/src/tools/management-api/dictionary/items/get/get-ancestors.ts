import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getTreeDictionaryAncestorsQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetDictionaryAncestorsTool = CreateUmbracoTool(
  "get-dictionary-ancestors",
  "Gets the ancestors of a dictionary item by Id",
  getTreeDictionaryAncestorsQueryParams.shape,
  async (params) => {
    try {
      const client = UmbracoManagementClient.getClient();
      var response = await client.getTreeDictionaryAncestors(params);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting dictionary ancestors:", error);
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

export default GetDictionaryAncestorsTool; 