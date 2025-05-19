import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { postLogViewerSavedSearchBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { SavedLogSearchRequestModel } from "@/umb-management-api/schemas/index.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";

const PostLogViewerSavedSearchTool = CreateUmbracoTool(
  "post-log-viewer-saved-search",
  "Create a new log viewer saved search",
  postLogViewerSavedSearchBody.shape,
  async (model: SavedLogSearchRequestModel) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.postLogViewerSavedSearch(model);

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

export default PostLogViewerSavedSearchTool;
