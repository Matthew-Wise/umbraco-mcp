import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getRecycleBinMediaChildrenQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetRecycleBinMediaChildrenTool = CreateUmbracoTool(
  "get-recycle-bin-media-children",
  "Gets child items for a media item in the recycle bin.",
  getRecycleBinMediaChildrenQueryParams.shape,
  async (params) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getRecycleBinMediaChildren(params);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting recycle bin media children:", error);
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

export default GetRecycleBinMediaChildrenTool; 