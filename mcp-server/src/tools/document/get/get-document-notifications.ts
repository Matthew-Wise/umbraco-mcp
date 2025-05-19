import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getDocumentByIdNotificationsParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetDocumentNotificationsTool = CreateUmbracoTool(
  "get-document-notifications",
  "Gets the notifications for a document by Id.",
  getDocumentByIdNotificationsParams.shape,
  async ({ id }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getDocumentByIdNotifications(id);
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

export default GetDocumentNotificationsTool; 