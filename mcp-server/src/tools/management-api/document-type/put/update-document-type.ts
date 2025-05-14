import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { UpdateDocumentTypeRequestModel } from "@/umb-management-api/schemas/index.js";
import {
  putDocumentTypeByIdParams,
  putDocumentTypeByIdBody,
} from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { z } from "zod";

const UpdateDocumentTypeTool = CreateUmbracoTool(
  "update-document-type",
  "Updates a document type by Id",
  {
    id: putDocumentTypeByIdParams.shape.id,
    data: z.object(putDocumentTypeByIdBody.shape),
  },
  async (model: { id: string; data: UpdateDocumentTypeRequestModel }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.putDocumentTypeById(model.id, model.data);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error updating document type:", error);
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

export default UpdateDocumentTypeTool; 