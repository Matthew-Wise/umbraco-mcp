import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";

const GetMediaTypeConfigurationTool = CreateUmbracoTool(
  "get-media-type-configuration",
  "Gets the configuration for media types",
  {},
  async () => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getMediaTypeConfiguration();

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting media type configuration:", error);
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

export default GetMediaTypeConfigurationTool; 