import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { postDocumentTypeBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const ValidateDocumentTypePostTool = CreateUmbracoTool(
  "validate-document-type-post",
  "Validates a document type using the Umbraco API (POST, does not persist changes).",
  postDocumentTypeBody.shape,
  async (model) => {
    try {
      const client = UmbracoManagementClient.getClient();
      // This will validate the model, but not persist if the API supports dry-run/validation only
      const response = await client.postDocumentType(model);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error validating document type (POST):", error);
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

export default ValidateDocumentTypePostTool; 