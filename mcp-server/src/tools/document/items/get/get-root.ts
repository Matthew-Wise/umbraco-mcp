import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getTreeDocumentRootQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetDocumentRootTool = CreateUmbracoTool(
  "get-document-root",
  "Gets root items for documents.",
  getTreeDocumentRootQueryParams.shape,
  async (params) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getTreeDocumentRoot(params);
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

export default GetDocumentRootTool; 