import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { putMediaTypeByIdMoveBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { MoveMediaTypeRequestModel } from "@/umb-management-api/schemas/moveMediaTypeRequestModel.js";
import { z } from "zod";

const MoveMediaTypeTool = CreateUmbracoTool(
  "move-media-type",
  "Move a media type to a new location",
  {
    id: z.string().uuid(),
    data: z.object(putMediaTypeByIdMoveBody.shape)
  },
  async (model: { id: string; data: MoveMediaTypeRequestModel }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.putMediaTypeByIdMove(model.id, model.data);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response)
          }
        ]
      };
    } catch (error) {
      console.error("Error moving media type:", error);
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

export default MoveMediaTypeTool; 