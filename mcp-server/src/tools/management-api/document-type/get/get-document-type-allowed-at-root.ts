import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { getDocumentTypeAllowedAtRootQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { GetDocumentTypeAllowedAtRootParams } from "@/umb-management-api/schemas/index.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";

const GetDocumentTypeAllowedAtRootTool = CreateUmbracoTool(
  "get-document-type-allowed-at-root",
  "Get document types that are allowed at root level",
  getDocumentTypeAllowedAtRootQueryParams.shape,
  async (model: GetDocumentTypeAllowedAtRootParams) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getDocumentTypeAllowedAtRoot(model);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response)
          }
        ]
      };
    } catch (error) {
      console.error("Error getting document types allowed at root:", error);
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${error}`
          }
        ]
      };
    }
  }
);

export default GetDocumentTypeAllowedAtRootTool; 