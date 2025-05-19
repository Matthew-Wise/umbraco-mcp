import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { deleteWebhookByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const DeleteWebhookTool = CreateUmbracoTool(
  "delete-webhook",
  "Deletes a webhook by id",
  deleteWebhookByIdParams.shape,
  async ({ id }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.deleteWebhookById(id);

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

export default DeleteWebhookTool; 