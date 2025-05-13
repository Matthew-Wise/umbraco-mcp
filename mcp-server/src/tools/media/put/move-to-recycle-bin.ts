import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { putMediaByIdMoveToRecycleBinParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";

const MoveMediaToRecycleBinTool = CreateUmbracoTool(
  "move-media-to-recycle-bin",
  "Move a media item to the recycle bin",
  putMediaByIdMoveToRecycleBinParams.shape,
  async ({ id }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.putMediaByIdMoveToRecycleBin(id);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response)
          }
        ]
      };
    } catch (error) {
      console.error("Error moving media to recycle bin:", error);
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

export default MoveMediaToRecycleBinTool; 