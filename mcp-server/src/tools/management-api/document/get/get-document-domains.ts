import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getDocumentByIdDomainsParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetDocumentDomainsTool = CreateUmbracoTool(
  "get-document-domains",
  "Gets the domains assigned to a document by Id.",
  getDocumentByIdDomainsParams.shape,
  async ({ id }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getDocumentByIdDomains(id);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting document domains:", error);
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

export default GetDocumentDomainsTool; 