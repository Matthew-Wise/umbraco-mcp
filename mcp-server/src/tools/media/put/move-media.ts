import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { putMediaByIdMoveBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { z } from "zod";

const MoveMediaTool = CreateUmbracoTool(
  "move-media",
  "Move a media item to a new location",
  {
    id: z.string().uuid(),
    data: z.object(putMediaByIdMoveBody.shape),
  },
  async (model: { id: string; data: any }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.putMediaByIdMove(model.id, model.data);
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

export default MoveMediaTool; 