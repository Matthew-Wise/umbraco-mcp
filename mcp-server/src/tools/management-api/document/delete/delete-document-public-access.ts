import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { deleteDocumentByIdPublicAccessParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const DeleteDocumentPublicAccessTool = CreateUmbracoTool(
  "delete-document-public-access",
  "Removes public access settings from a document by Id.",
  deleteDocumentByIdPublicAccessParams.shape,
  async ({ id }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.deleteDocumentByIdPublicAccess(id);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error deleting document public access:", error);
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

export default DeleteDocumentPublicAccessTool; 