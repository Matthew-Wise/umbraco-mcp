import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { deleteMemberTypeByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const DeleteMemberTypeTool = CreateUmbracoTool(
  "delete-member-type",
  "Deletes a member type by id",
  deleteMemberTypeByIdParams.shape,
  async ({ id }) => {
    try {
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
    } catch (error) {
      console.error("Error deleting member type:", error);
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

export default DeleteMemberTypeTool; 