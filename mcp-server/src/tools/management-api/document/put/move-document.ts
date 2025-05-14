import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { putDocumentByIdMoveBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { z } from "zod";

const MoveDocumentTool = CreateUmbracoTool(
  "move-document",
  "Move a document to a new location",
  {
    id: z.string().uuid(),
    data: z.object(putDocumentByIdMoveBody.shape)
  },
  async (model: { id: string; data: any }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.putDocumentByIdMove(model.id, model.data);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response)
          }
        ]
      };
    } catch (error) {
      console.error("Error moving document:", error);
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

export default MoveDocumentTool; 