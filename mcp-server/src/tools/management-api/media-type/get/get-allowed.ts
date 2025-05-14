import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getItemMediaTypeAllowedQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetAllowedMediaTypeTool = CreateUmbracoTool(
  "get-allowed-media-type", 
  "Gets allowed file extensions for media types",
  getItemMediaTypeAllowedQueryParams.shape,
  async (params) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getItemMediaTypeAllowed(params);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting allowed media types:", error);
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

export default GetAllowedMediaTypeTool;