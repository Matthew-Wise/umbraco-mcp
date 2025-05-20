import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getMediaUrlsQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetMediaUrlsTool = CreateUmbracoTool(
  "get-media-urls",
  "Gets the URLs for a media item.",
  getMediaUrlsQueryParams.shape,
  async (params) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getMediaUrls(params);
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

export default GetMediaUrlsTool; 