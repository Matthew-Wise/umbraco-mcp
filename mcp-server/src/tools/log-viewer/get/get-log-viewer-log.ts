import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { getLogViewerLogQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { GetLogViewerLogParams } from "@/umb-management-api/schemas/index.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";

const GetLogViewerLogTool = CreateUmbracoTool(
  "get-log-viewer-log",
  "Get log viewer logs",
  getLogViewerLogQueryParams.shape,
  async (model: GetLogViewerLogParams) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getLogViewerLog(model);

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

export default GetLogViewerLogTool;
