import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { GetTreeDocumentTypeChildrenParams } from "@/umb-management-api/schemas/index.js";
import { getTreeDocumentTypeChildrenQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetDocumentTypeChildrenTool = CreateUmbracoTool(
  "get-document-type-children",
  "Gets the children of a document type",
  getTreeDocumentTypeChildrenQueryParams.shape,
  async (params: GetTreeDocumentTypeChildrenParams) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getTreeDocumentTypeChildren(params);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting document type children:", error);
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

export default GetDocumentTypeChildrenTool; 