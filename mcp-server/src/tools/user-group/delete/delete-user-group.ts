import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { deleteUserGroupByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const DeleteUserGroupTool = CreateUmbracoTool(
  "delete-user-group",
  "Deletes a user group by Id",
  deleteUserGroupByIdParams.shape,
  async ({ id }) => {
    const client = UmbracoManagementClient.getClient();
    var response = await client.deleteUserGroupById(id);

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

export default DeleteUserGroupTool; 