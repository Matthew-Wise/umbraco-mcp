import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getItemMediaQueryParams, getItemMediaResponse } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetMediaByIdArrayTool = CreateUmbracoTool(
  "get-media-by-id-array",
  "Gets media items by an array of IDs",
  getItemMediaQueryParams.shape,
  async (params) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getItemMedia(params);
      // Validate response shape
      getItemMediaResponse.parse(response);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting media by id array:", error);
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

export default GetMediaByIdArrayTool; 