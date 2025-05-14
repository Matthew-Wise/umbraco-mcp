import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { MoveDataTypeRequestModel } from "@/umb-management-api/schemas/index.js";
import {
  putDataTypeByIdMoveParams,
  putDataTypeByIdMoveBody,
} from "@/umb-management-api/umbracoManagementAPI.zod.js";

import { z } from "zod";

const MoveDataTypeTool = CreateUmbracoTool(
  "move-data-type",
  "Updates a data type by Id",
  {
    id: putDataTypeByIdMoveParams.shape.id,
    data: z.object(putDataTypeByIdMoveBody.shape),
  },
  async (model: { id: string; data: MoveDataTypeRequestModel }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      var response = await client.putDataTypeByIdMove(model.id, model.data);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error creating data type:", error);
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

export default MoveDataTypeTool;
