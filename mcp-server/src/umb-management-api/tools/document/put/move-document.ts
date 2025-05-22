import { UmbracoManagementClient } from "@umb-management-client";
import { putDocumentByIdMoveBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { z } from "zod";

const MoveDocumentTool = CreateUmbracoTool(
  "move-document",
  "Move a document to a new location",
  {
    id: z.string().uuid(),
    data: z.object(putDocumentByIdMoveBody.shape),
  },
  async (model: { id: string; data: any }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.putDocumentByIdMove(model.id, model.data);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(response),
        },
      ],
    };
  }
);

export default MoveDocumentTool;
