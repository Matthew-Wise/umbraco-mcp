import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";

const GetAllowedMediaTypeTool = CreateUmbracoTool(
  "get-allowed-media-type",
  "Gets allowed file extensions for media types",
  {},
  async () => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getItemMediaTypeAllowed();

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