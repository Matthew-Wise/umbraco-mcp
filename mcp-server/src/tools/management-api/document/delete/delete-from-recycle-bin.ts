import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { deleteDocumentByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const DeleteFromRecycleBinTool = CreateUmbracoTool(
  "delete-from-recycle-bin",
  "Deletes a document from the recycle bin by Id.",
  deleteDocumentByIdParams.shape,
  async ({ id }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.deleteDocumentById(id);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error deleting document from recycle bin:", error);
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

export default DeleteFromRecycleBinTool; 