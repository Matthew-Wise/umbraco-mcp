import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getDocumentByIdPublicAccessParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetDocumentPublicAccessTool = CreateUmbracoTool(
  "get-document-public-access",
  "Gets the public access settings for a document by Id.",
  getDocumentByIdPublicAccessParams.shape,
  async ({ id }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getDocumentByIdPublicAccess(id);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting document public access:", error);
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

export default GetDocumentPublicAccessTool; 