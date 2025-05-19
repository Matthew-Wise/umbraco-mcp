import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { deleteMemberByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const DeleteMemberTool = CreateUmbracoTool(
  "delete-member",
  "Deletes a member by Id",
  deleteMemberByIdParams.shape,
  async ({ id }) => {
    try {
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
    } catch (error) {
      console.error("Error deleting member:", error);
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

export default DeleteMemberTool;
