import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { GetTreeMediaTypeRootParams } from "@/umb-management-api/schemas/index.js";
import { getTreeMediaTypeRootQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetMediaTypeRootTool = CreateUmbracoTool(
  "get-media-type-root",
  "Gets the root level of the media type tree",
  getTreeMediaTypeRootQueryParams.shape,
  async (params: GetTreeMediaTypeRootParams) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getTreeMediaTypeRoot(params);

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

export default GetMediaTypeRootTool; 