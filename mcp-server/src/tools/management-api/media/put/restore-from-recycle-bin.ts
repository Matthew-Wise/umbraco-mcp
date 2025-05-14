import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { putRecycleBinMediaByIdRestoreParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const RestoreFromRecycleBinTool = CreateUmbracoTool(
  "restore-media-from-recycle-bin",
  "Restores a media item from the recycle bin.",
  putRecycleBinMediaByIdRestoreParams.shape,
  async ({ id }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.putRecycleBinMediaByIdRestore(id, { target: null });
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error restoring media from recycle bin:", error);
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