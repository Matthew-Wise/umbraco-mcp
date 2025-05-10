import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getWebhookLogsQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetAllWebhookLogsTool = CreateUmbracoTool(
  "get-all-webhook-logs",
  "Gets logs for all webhooks",
  getWebhookLogsQueryParams.shape,
  async (params: { skip?: number; take?: number }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getWebhookLogs(params);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting webhook logs:", error);
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

export default GetAllWebhookLogsTool; 