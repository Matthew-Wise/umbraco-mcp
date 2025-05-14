import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { deleteRedirectManagementByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const DeleteRedirectTool = CreateUmbracoTool(
  "delete-redirect",
  `Deletes a specific redirect by its ID.
  Parameters:
  - id: The unique identifier of the redirect to delete (string)
  
  Returns no content on success.`,
  deleteRedirectManagementByIdParams.shape,
  async ({ id }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      await client.deleteRedirectManagementById(id);

      return {
        content: [
          {
            type: "text" as const,
            text: "Redirect deleted successfully",
          },
        ],
      };
    } catch (error) {
      console.error("Error deleting redirect:", error);
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

export default DeleteRedirectTool; 