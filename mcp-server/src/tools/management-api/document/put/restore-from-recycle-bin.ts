import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { putRecycleBinDocumentByIdRestoreParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const RestoreFromRecycleBinTool = CreateUmbracoTool(
  "restore-document-from-recycle-bin",
  "Restores a document from the recycle bin.",
  putRecycleBinDocumentByIdRestoreParams.shape,
  async ({ id }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.putRecycleBinDocumentByIdRestore(id, { target: null });
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error restoring document from recycle bin:", error);
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

export default RestoreFromRecycleBinTool; 