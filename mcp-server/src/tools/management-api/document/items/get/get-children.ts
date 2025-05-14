import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getTreeDocumentChildrenQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetDocumentChildrenTool = CreateUmbracoTool(
  "get-document-children",
  "Gets child items for a document.",
  getTreeDocumentChildrenQueryParams.shape,
  async (params) => {
    try {
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
    } catch (error) {
      console.error("Error getting document children:", error);
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

export default GetDocumentChildrenTool; 