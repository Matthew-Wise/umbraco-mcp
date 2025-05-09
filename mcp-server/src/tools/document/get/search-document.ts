import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getItemDocumentSearchQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const SearchDocumentTool = CreateUmbracoTool(
  "search-document",
  "Searches for documents by query, skip, and take.",
  getItemDocumentSearchQueryParams.shape,
  async (params) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getItemDocumentSearch(params);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error searching documents:", error);
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

export default SearchDocumentTool; 