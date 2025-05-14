import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { MoveDictionaryRequestModel } from "@/umb-management-api/schemas/moveDictionaryRequestModel.js";
import { putDictionaryByIdMoveParams, putDictionaryByIdMoveBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { z } from "zod";

const MoveDictionaryItemTool = CreateUmbracoTool(
  "move-dictionary-item",
  "Moves a dictionary item by Id",
  {
    id: putDictionaryByIdMoveParams.shape.id,
    data: z.object(putDictionaryByIdMoveBody.shape)
  },
  async (model: { id: string; data: MoveDictionaryRequestModel}) => {
    try {
      const client = UmbracoManagementClient.getClient();
      var response = await client.putDictionaryByIdMove(model.id, model.data);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error moving dictionary item:", error);
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

export default MoveDictionaryItemTool; 