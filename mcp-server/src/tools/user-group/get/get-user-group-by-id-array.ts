import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getItemUserGroupQueryParams, getItemUserGroupResponse } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetUserGroupByIdArrayTool = CreateUmbracoTool(
  "get-user-group-by-id-array",
  "Gets user groups by an array of IDs",
  getItemUserGroupQueryParams.shape,
  async (params) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getItemUserGroup(params);
    // Validate response shape
    getItemUserGroupResponse.parse(response);
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

export default GetUserGroupByIdArrayTool; 