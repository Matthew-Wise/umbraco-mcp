import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getTreeMemberGroupRootQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetMemberGroupRootTool = CreateUmbracoTool(
  "get-member-group-root",
  "Gets the root level of the member group tree",
  getTreeMemberGroupRootQueryParams.shape,
  async (params) => {
    try {
      const client = UmbracoManagementClient.getClient();
      var response = await client.getTreeMemberGroupRoot(params);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting member group root:", error);
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

export default GetMemberGroupRootTool; 