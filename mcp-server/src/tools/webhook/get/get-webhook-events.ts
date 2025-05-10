import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";

const GetWebhookEventsTool = CreateUmbracoTool(
  "get-webhook-events",
  "Gets a list of available webhook events",
  {},
  async () => {
    try {
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
    } catch (error) {
      console.error("Error getting webhook events:", error);
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

export default GetWebhookEventsTool; 