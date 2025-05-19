import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { putDocumentByIdPublishBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { z } from "zod";

const PublishDocumentTool = CreateUmbracoTool(
  "publish-document",
  `Publishes a document by Id. 
  When the culture is not provided, the default culture is null.
  When the schedule is not provided, the default schedule is null.`,
  {
    id: z.string().uuid(),
    data: z.object(putDocumentByIdPublishBody.shape),
  },
  async (model: { id: string; data: any }) => {
    const client = UmbracoManagementClient.getClient();

    // If no publish schedules are provided, set the default to publish to all cultures
    if (!model.data.publishSchedules) {
      model.data.publishSchedules = [{ culture: null }];
    }

    const response = await client.putDocumentByIdPublish(model.id, model.data);
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

export default PublishDocumentTool; 