import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { deleteDocumentTypeFolderByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const DeleteDocumentTypeFolderTool = CreateUmbracoTool(
  "delete-document-type-folder",
  "Deletes a document type folder by Id",
  deleteDocumentTypeFolderByIdParams.shape,
  async ({ id }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.deleteDocumentTypeFolderById(id);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error deleting document type folder:", error);
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

export default DeleteDocumentTypeFolderTool; 