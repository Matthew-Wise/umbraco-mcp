import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getLogViewerSavedSearchByNameParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetLogViewerSavedSearchByNameTool = CreateUmbracoTool(
  "get-log-viewer-saved-search-by-name",
  "Gets a saved search by name",
  getLogViewerSavedSearchByNameParams.shape,
  async ({ name }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getLogViewerSavedSearchByName(name);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting saved search:", error);
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

export default GetLogViewerSavedSearchByNameTool;
