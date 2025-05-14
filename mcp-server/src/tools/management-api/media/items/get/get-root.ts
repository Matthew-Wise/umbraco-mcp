import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getTreeMediaRootQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetMediaRootTool = CreateUmbracoTool(
  "get-media-root",
  "Gets root items for media.",
  getTreeMediaRootQueryParams.shape,
  async (params) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getTreeMediaRoot(params);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting media root:", error);
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

export default GetMediaRootTool; 