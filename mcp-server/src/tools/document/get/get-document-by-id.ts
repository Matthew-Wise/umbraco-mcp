import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getDocumentByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetDocumentByIdTool = CreateUmbracoTool(
  "get-document-by-id",
  `Gets a document by id
  Use this to retrieve existing documents. When creating new documents, 
  first get an existing document of similar type, then use the Copy document endpoint.`,
  getDocumentByIdParams.shape,
  async ({ id }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getDocumentById(id);
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

export default GetDocumentByIdTool; 