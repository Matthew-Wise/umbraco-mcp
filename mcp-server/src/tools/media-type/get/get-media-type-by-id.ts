import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getMediaTypeByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetMediaTypeByIdTool = CreateUmbracoTool(
  "get-media-type-by-id",
  "Gets a media type by id",
  getMediaTypeByIdParams.shape,
  async ({ id }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getMediaTypeById(id);

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

export default GetMediaTypeByIdTool; 