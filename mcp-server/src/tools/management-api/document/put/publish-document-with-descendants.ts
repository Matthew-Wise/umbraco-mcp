import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { putDocumentByIdPublishWithDescendantsBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { z } from "zod";

const PublishDocumentWithDescendantsTool = CreateUmbracoTool(
  "publish-document-with-descendants",
  "Publishes a document and its descendants by Id.",
  {
    id: z.string().uuid(),
    data: z.object(putDocumentByIdPublishWithDescendantsBody.shape)
  },
  async (model: { id: string; data: any }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.putDocumentByIdPublishWithDescendants(model.id, model.data);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error publishing document with descendants:", error);
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

export default PublishDocumentWithDescendantsTool; 