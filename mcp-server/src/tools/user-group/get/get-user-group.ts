import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getUserGroupByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetUserGroupTool = CreateUmbracoTool(
  "get-user-group",
  "Gets a user group by Id",
  getUserGroupByIdParams.shape,
  async ({ id }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getUserGroupById(id);

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

export default GetUserGroupTool; 