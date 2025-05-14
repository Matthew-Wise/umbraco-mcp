import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { putDocumentTypeByIdParams, putDocumentTypeByIdBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { z } from "zod";

const ValidateDocumentTypeTool = CreateUmbracoTool(
  "validate-document-type",
  "Validates a document type using the Umbraco API (PUT, does not persist changes).",
  {
    id: putDocumentTypeByIdParams.shape.id,
    data: z.object(putDocumentTypeByIdBody.shape),
  },
  async (model: { id: string; data: any }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      // This will validate the model, but not persist if the API supports dry-run/validation only
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
      console.error("Error validating document type:", error);
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

export default ValidateDocumentTypeTool; 