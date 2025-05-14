import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { GetTreeDocumentTypeRootParams } from "@/umb-management-api/schemas/index.js";
import { getTreeDocumentTypeRootQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetDocumentTypeRootTool = CreateUmbracoTool(
  "get-document-type-root",
  "Gets the root level of the document type tree",
  getTreeDocumentTypeRootQueryParams.shape,
  async (params: GetTreeDocumentTypeRootParams) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getTreeDocumentTypeRoot(params);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting document type root:", error);
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

export default GetDocumentTypeRootTool; 