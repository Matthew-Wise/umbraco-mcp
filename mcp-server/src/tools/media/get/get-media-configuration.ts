import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getMediaConfigurationResponse } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetMediaConfigurationTool = CreateUmbracoTool(
  "get-media-configuration",
  "Gets the media configuration for the Umbraco instance.",
  {},
  async () => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getMediaConfiguration();
    // Optionally validate response
    getMediaConfigurationResponse.parse(response);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(response),
        },
      ],
    };
  }
);

export default GetMediaConfigurationTool; 