import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { deleteLogViewerSavedSearchByNameParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const DeleteLogViewerSavedSearchByNameTool = CreateUmbracoTool(
  "delete-log-viewer-saved-search-by-name",
  "Deletes a saved search by name",
  deleteLogViewerSavedSearchByNameParams.shape,
  async ({ name }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.deleteLogViewerSavedSearchByName(name);

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

export default DeleteLogViewerSavedSearchByNameTool;
