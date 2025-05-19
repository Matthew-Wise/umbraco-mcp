import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getTreeDocumentChildrenQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetDocumentChildrenTool = CreateUmbracoTool(
  "get-document-children",
  "Gets child items for a document.",
  getTreeDocumentChildrenQueryParams.shape,
  async (params) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getTreeDocumentChildren(params);
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

export default GetDocumentChildrenTool; 