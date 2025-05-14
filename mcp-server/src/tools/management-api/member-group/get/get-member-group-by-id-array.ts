import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getItemMemberGroupQueryParams, getItemMemberGroupResponse } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetMemberGroupByIdArrayTool = CreateUmbracoTool(
  "get-member-group-by-id-array",
  "Gets member groups by an array of IDs",
  getItemMemberGroupQueryParams.shape,
  async (params) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getItemMemberGroup(params);
      // Validate response shape
      getItemMemberGroupResponse.parse(response);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting member groups by id array:", error);
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

export default GetMemberGroupByIdArrayTool; 