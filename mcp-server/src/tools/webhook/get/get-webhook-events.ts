import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";

const GetWebhookEventsTool = CreateUmbracoTool(
  "get-webhook-events",
  "Gets a list of available webhook events",
  {},
  async () => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getWebhookEvents();

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

export default GetWebhookEventsTool; 