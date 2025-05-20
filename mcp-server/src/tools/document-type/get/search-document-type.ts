import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { getItemDocumentTypeSearchQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";

const SearchDocumentTypeTool = CreateUmbracoTool(
  "search-document-type",
  "Search for document types by name",
  getItemDocumentTypeSearchQueryParams.shape,
  async (model) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getItemDocumentTypeSearch(model);

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(response),
        },
      ],
    };
  }
);

export default SearchDocumentTypeTool; 