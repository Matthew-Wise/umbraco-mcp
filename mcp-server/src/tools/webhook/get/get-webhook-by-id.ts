import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getWebhookByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetWebhookByIdTool = CreateUmbracoTool(
  "get-webhook-by-id",
  "Gets a webhook by id",
  getWebhookByIdParams.shape,
  async ({ id }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getWebhookById(id);

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

export default GetWebhookByIdTool; 