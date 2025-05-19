import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { CreateWebhookRequestModel } from "@/umb-management-api/schemas/index.js";
import { postWebhookBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const CreateWebhookTool = CreateUmbracoTool(
  "create-webhook",
  `Creates a new webhook
  Must contain at least one event from the events listed at /umbraco/management/api/v1/webhook/events endpoint.
  Cannot mix different event types in the same webhook.`,
  postWebhookBody.shape,
  async (model: CreateWebhookRequestModel) => {
    const client = UmbracoManagementClient.getClient();
    var response = await client.postWebhook(model);

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

export default CreateWebhookTool; 