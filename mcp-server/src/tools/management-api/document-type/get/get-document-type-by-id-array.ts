import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getItemDocumentTypeQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetDocumentTypesByIdArrayTool = CreateUmbracoTool(
  "get-document-types-by-id-array",
  "Gets document types by IDs (or empty array if no IDs are provided)",
  getItemDocumentTypeQueryParams.shape,
  async (params) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getItemDocumentType(params);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting item document types:", error);
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

export default GetDocumentTypesByIdArrayTool; 