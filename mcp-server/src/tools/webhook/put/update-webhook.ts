import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { UpdateWebhookRequestModel } from "@/umb-management-api/schemas/index.js";
import {
  putWebhookByIdBody,
  putWebhookByIdParams,
} from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { z } from "zod";

const UpdateWebhookTool = CreateUmbracoTool(
  "update-webhook",
  "Updates a webhook by id",
  {
    id: putWebhookByIdParams.shape.id,
    data: z.object(putWebhookByIdBody.shape),
  },
  async (model: { id: string; data: UpdateWebhookRequestModel }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.putWebhookById(model.id, model.data);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error updating webhook:", error);
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

export default UpdateWebhookTool; 