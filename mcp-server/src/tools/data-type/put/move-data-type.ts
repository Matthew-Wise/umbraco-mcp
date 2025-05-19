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
  "Move a data type by Id",
  {
    id: putDataTypeByIdMoveParams.shape.id,
    body: z.object(putDataTypeByIdMoveBody.shape),
  },
  async ({ id, body }: { id: string; body: MoveDataTypeRequestModel }) => {
    const client = UmbracoManagementClient.getClient();
    var response = await client.putDataTypeByIdMove(id, body);

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

export default MoveDataTypeTool;
