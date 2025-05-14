import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getFilterUserGroupQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetFilterUserGroupTool = CreateUmbracoTool(
  "get-filter-user-group",
  "Gets filtered user groups",
  getFilterUserGroupQueryParams.shape,
  async ({ skip, take, filter }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getFilterUserGroup({ skip, take, filter });

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting filtered user groups:", error);
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

export default GetFilterUserGroupTool; 