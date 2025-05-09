import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { putDocumentByIdMoveToRecycleBinParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";

const MoveDocumentToRecycleBinTool = CreateUmbracoTool(
  "move-document-to-recycle-bin",
  "Move a document to the recycle bin",
  putDocumentByIdMoveToRecycleBinParams.shape,
  async ({ id }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.putDocumentByIdMoveToRecycleBin(id);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response)
          }
        ]
      };
    } catch (error) {
      console.error("Error moving document to recycle bin:", error);
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${error}`
          }
        ]
      };
    }
  }
);

export default MoveDocumentToRecycleBinTool; 