import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getMediaTypeFolderByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetMediaTypeFolderTool = CreateUmbracoTool(
  "get-media-type-folder",
  "Gets a media type folder by Id",
  getMediaTypeFolderByIdParams.shape,
  async ({ id }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getMediaTypeFolderById(id);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting media type folder:", error);
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

export default GetMediaTypeFolderTool; 