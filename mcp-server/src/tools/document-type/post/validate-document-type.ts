import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { postDocumentTypeBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const ValidateDocumentTypePostTool = CreateUmbracoTool(
  "validate-document-type-post",
  "Validates a document type using the Umbraco API (POST, does not persist changes).",
  postDocumentTypeBody.shape,
  async (model) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.postDocumentType(model);
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

export default ValidateDocumentTypePostTool; 