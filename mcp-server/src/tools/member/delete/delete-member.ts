import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { deleteMemberByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const DeleteMemberTool = CreateUmbracoTool(
  "delete-member",
  "Deletes a member by Id",
  deleteMemberByIdParams.shape,
  async ({ id }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.deleteMemberById(id);

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

export default DeleteMemberTool;
