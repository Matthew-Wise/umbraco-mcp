import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { MoveDocumentBlueprintRequestModel } from "@/umb-management-api/schemas/moveDocumentBlueprintRequestModel.js";
import { putDocumentBlueprintByIdMoveParams, putDocumentBlueprintByIdMoveBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { z } from "zod";

const MoveDocumentBlueprintTool = CreateUmbracoTool(
  "move-document-blueprint",
  "Moves a document blueprint by Id",
  {
    id: putDocumentBlueprintByIdMoveParams.shape.id,
    data: z.object(putDocumentBlueprintByIdMoveBody.shape),
  },
  async (model: { id: string; data: MoveDocumentBlueprintRequestModel }) => {
    const client = UmbracoManagementClient.getClient();
    var response = await client.putDocumentBlueprintByIdMove(
      model.id,
      model.data
    );
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

export default MoveDocumentBlueprintTool; 