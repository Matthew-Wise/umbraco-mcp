import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getItemWebhookQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetWebhookItemTool = CreateUmbracoTool(
  "get-webhook-item",
  "Gets webhooks by IDs (or empty array if no IDs are provided)",
  getItemWebhookQueryParams.shape,
  async (params: { id?: string[] }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getItemWebhook(params);

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

export default GetWebhookItemTool; 