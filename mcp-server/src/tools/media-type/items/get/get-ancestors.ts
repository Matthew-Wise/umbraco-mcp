import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { GetTreeMediaTypeAncestorsParams } from "@/umb-management-api/schemas/index.js";
import { getTreeMediaTypeAncestorsQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetMediaTypeAncestorsTool = CreateUmbracoTool(
  "get-media-type-ancestors",
  "Gets the ancestors of a media type",
  getTreeMediaTypeAncestorsQueryParams.shape,
  async (params: GetTreeMediaTypeAncestorsParams) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getTreeMediaTypeAncestors(params);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting media type ancestors:", error);
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

export default GetMediaTypeAncestorsTool; 