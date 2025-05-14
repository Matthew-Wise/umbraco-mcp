import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { deleteMemberGroupByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const DeleteMemberGroupTool = CreateUmbracoTool(
  "delete-member-group",
  "Deletes a member group by Id",
  deleteMemberGroupByIdParams.shape,
  async ({ id }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      var response = await client.deleteMemberGroupById(id);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error deleting member group:", error);
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

export default DeleteMemberGroupTool; 