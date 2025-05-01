import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { MoveDocumentTypeRequestModel } from "@/umb-management-api/schemas/index.js";
import {
  putDocumentTypeByIdMoveParams,
  putDocumentTypeByIdMoveBody,
} from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { z } from "zod";

const MoveDocumentTypeTool = CreateUmbracoTool(
  "move-document-type",
  "Moves a document type to a new location",
  {
    id: putDocumentTypeByIdMoveParams.shape.id,
    data: z.object(putDocumentTypeByIdMoveBody.shape),
  },
  async (model: { id: string; data: MoveDocumentTypeRequestModel }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.putDocumentTypeByIdMove(model.id, model.data);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error moving document type:", error);
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

export default MoveDocumentTypeTool; 