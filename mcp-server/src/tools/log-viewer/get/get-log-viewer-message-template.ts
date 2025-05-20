import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { getLogViewerMessageTemplateQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { GetLogViewerMessageTemplateParams } from "@/umb-management-api/schemas/index.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";

const GetLogViewerMessageTemplateTool = CreateUmbracoTool(
  "get-log-viewer-message-template",
  "Get log viewer message templates",
  getLogViewerMessageTemplateQueryParams.shape,
  async (model: GetLogViewerMessageTemplateParams) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getLogViewerMessageTemplate(model);

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

export default GetLogViewerMessageTemplateTool;
