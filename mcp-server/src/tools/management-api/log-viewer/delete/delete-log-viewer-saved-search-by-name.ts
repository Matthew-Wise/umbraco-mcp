import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { deleteLogViewerSavedSearchByNameParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const DeleteLogViewerSavedSearchByNameTool = CreateUmbracoTool(
  "delete-log-viewer-saved-search-by-name",
  "Deletes a saved search by name",
  deleteLogViewerSavedSearchByNameParams.shape,
  async ({ name }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      await client.deleteLogViewerSavedSearchByName(name);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({ success: true }),
          },
        ],
      };
    } catch (error) {
      console.error("Error deleting saved search:", error);
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

export default DeleteLogViewerSavedSearchByNameTool;
