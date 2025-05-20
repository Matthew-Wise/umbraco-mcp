import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getMediaByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetMediaByIdTool = CreateUmbracoTool(
  "get-media-by-id",
  `Gets a media item by id
  Use this to retrieve existing media items.`,
  getMediaByIdParams.shape,
  async ({ id }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getMediaById(id);
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

export default GetMediaByIdTool; 