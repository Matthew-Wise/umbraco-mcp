import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { deleteMemberTypeByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const DeleteMemberTypeTool = CreateUmbracoTool(
  "delete-member-type",
  "Deletes a member type by id",
  deleteMemberTypeByIdParams.shape,
  async ({ id }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.deleteMemberTypeById(id);

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

export default DeleteMemberTypeTool; 