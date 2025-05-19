import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { postDocumentValidateBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const ValidateDocumentTool = CreateUmbracoTool(
  "validate-document",
  "Validates a document using the Umbraco API.",
  postDocumentValidateBody.shape,
  async (model) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.postDocumentValidate(model);
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

export default ValidateDocumentTool; 