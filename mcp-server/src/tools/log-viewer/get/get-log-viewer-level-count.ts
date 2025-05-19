import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { getLogViewerLevelCountQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { GetLogViewerLevelCountParams } from "@/umb-management-api/schemas/index.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";

const GetLogViewerLevelCountTool = CreateUmbracoTool(
  "get-log-viewer-level-count",
  "Get log viewer level counts",
  getLogViewerLevelCountQueryParams.shape,
  async (model: GetLogViewerLevelCountParams) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getLogViewerLevelCount(model);

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

export default GetLogViewerLevelCountTool;
