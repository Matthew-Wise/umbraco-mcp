import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { getLogViewerValidateLogsSizeQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { GetLogViewerValidateLogsSizeParams } from "@/umb-management-api/schemas/index.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";

const GetLogViewerValidateLogsSizeTool = CreateUmbracoTool(
  "get-log-viewer-validate-logs-size",
  "Validates the size of the logs, for the given start and end date, or the lase day if not provided",
  getLogViewerValidateLogsSizeQueryParams.shape,
  async (model: GetLogViewerValidateLogsSizeParams) => {
    const client = UmbracoManagementClient.getClient();
    await client.getLogViewerValidateLogsSize(model);

    return {
      content: [
        {
          type: "text" as const,
          text: "allowed access",
        },
      ],
    };
  }
);

export default GetLogViewerValidateLogsSizeTool;
