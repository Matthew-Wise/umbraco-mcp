import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getTreeMediaChildrenQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetMediaChildrenTool = CreateUmbracoTool(
  "get-media-children",
  "Gets child items for a media.",
  getTreeMediaChildrenQueryParams.shape,
  async (params) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getTreeMediaChildren(params);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting media children:", error);
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

export default GetMediaChildrenTool; 