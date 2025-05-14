import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getDocumentUrlsQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetDocumentUrlsTool = CreateUmbracoTool(
  "get-document-urls",
  "Gets the URLs for a document.",
  getDocumentUrlsQueryParams.shape,
  async (params) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getDocumentUrls(params);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting document URLs:", error);
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

export default GetDocumentUrlsTool; 