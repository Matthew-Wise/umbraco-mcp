import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { putDocumentByIdNotificationsParams, putDocumentByIdNotificationsBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { z } from "zod";

const PutDocumentNotificationsTool = CreateUmbracoTool(
  "put-document-notifications",
  "Updates the notifications for a document by Id.",
  {
    id: putDocumentByIdNotificationsParams.shape.id,
    data: z.object(putDocumentByIdNotificationsBody.shape),
  },
  async (model: { id: string; data: any }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.putDocumentByIdNotifications(
      model.id,
      model.data
    );
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

export default PutDocumentNotificationsTool; 