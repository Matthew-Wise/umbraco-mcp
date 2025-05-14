import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { deleteDocumentBlueprintFolderByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const DeleteDocumentBlueprintFolderTool = CreateUmbracoTool(
  "delete-document-blueprint-folder",
  "Deletes a document blueprint folder by Id",
  deleteDocumentBlueprintFolderByIdParams.shape,
  async ({ id }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      var response = await client.deleteDocumentBlueprintFolderById(id);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error deleting document blueprint folder:", error);
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

export default DeleteDocumentBlueprintFolderTool; 