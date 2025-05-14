import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { GetTreeDocumentTypeAncestorsParams } from "@/umb-management-api/schemas/index.js";
import { getTreeDocumentTypeAncestorsQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetDocumentTypeAncestorsTool = CreateUmbracoTool(
  "get-document-type-ancestors",
  "Gets the ancestors of a document type",
  getTreeDocumentTypeAncestorsQueryParams.shape,
  async (params: GetTreeDocumentTypeAncestorsParams) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getTreeDocumentTypeAncestors(params);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting document type ancestors:", error);
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

export default GetDocumentTypeAncestorsTool; 