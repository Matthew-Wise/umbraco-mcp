import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getDocumentTypeByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetDocumentTypeByIdTool = CreateUmbracoTool(
  "get-document-type-by-id",
  "Gets a document type by id",
  getDocumentTypeByIdParams.shape,
  async ({ id }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getDocumentTypeById(id);

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

export default GetDocumentTypeByIdTool; 