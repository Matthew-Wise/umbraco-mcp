import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { getLogViewerLevelQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { GetLogViewerLevelParams } from "@/umb-management-api/schemas/index.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";

const GetLogViewerLevelTool = CreateUmbracoTool(
  "get-log-viewer-level",
  "Get log viewer levels",
  getLogViewerLevelQueryParams.shape,
  async (model: GetLogViewerLevelParams) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getLogViewerLevel(model);

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

export default GetLogViewerLevelTool;
