import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getWebhookByIdLogsParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetWebhookLogsTool = CreateUmbracoTool(
  "get-webhook-logs",
  "Gets logs for a specific webhook",
  getWebhookByIdLogsParams.shape,
  async ({ id }: { id: string }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getWebhookByIdLogs(id);

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

export default GetWebhookLogsTool; 