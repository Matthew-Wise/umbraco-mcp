import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { getLogViewerSavedSearchQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { GetLogViewerSavedSearchParams } from "@/umb-management-api/schemas/index.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";

const GetLogViewerSavedSearchTool = CreateUmbracoTool(
  "get-log-viewer-saved-search",
  "Get log viewer saved searches",
  getLogViewerSavedSearchQueryParams.shape,
  async (model: GetLogViewerSavedSearchParams) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getLogViewerSavedSearch(model);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting log viewer saved searches:", error);
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

export default GetLogViewerSavedSearchTool;
