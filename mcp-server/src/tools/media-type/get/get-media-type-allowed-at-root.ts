import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { getMediaTypeAllowedAtRootQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { GetMediaTypeAllowedAtRootParams } from "@/umb-management-api/schemas/index.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";

const GetMediaTypeAllowedAtRootTool = CreateUmbracoTool(
  "get-media-type-allowed-at-root",
  "Get media types that are allowed at root level",
  getMediaTypeAllowedAtRootQueryParams.shape,
  async (model: GetMediaTypeAllowedAtRootParams) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getMediaTypeAllowedAtRoot(model);

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

export default GetMediaTypeAllowedAtRootTool; 