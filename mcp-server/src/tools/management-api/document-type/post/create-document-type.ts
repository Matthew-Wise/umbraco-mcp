import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { CreateDocumentTypeRequestModel } from "@/umb-management-api/schemas/index.js";
import { postDocumentTypeBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const CreateDocumentTypeTool = CreateUmbracoTool(
  "create-document-type",
  "Creates a new document type",
  postDocumentTypeBody.shape,
  async (model: CreateDocumentTypeRequestModel) => {
    try {
      const client = UmbracoManagementClient.getClient();
      var response = await client.postDocumentType(model);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error creating document type:", error);
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

export default CreateDocumentTypeTool; 