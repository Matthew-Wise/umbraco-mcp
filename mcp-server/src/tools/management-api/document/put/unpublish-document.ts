import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { putDocumentByIdUnpublishBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { z } from "zod";

const UnpublishDocumentTool = CreateUmbracoTool(
  "unpublish-document",
  "Unpublishes a document by Id.",
  {
    id: z.string().uuid(),
    data: z.object(putDocumentByIdUnpublishBody.shape)
  },
  async (model: { id: string; data: z.infer<typeof putDocumentByIdUnpublishBody> }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      if (!model.data.cultures) model.data.cultures = null;
      const response = await client.putDocumentByIdUnpublish(model.id, model.data);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error unpublishing document:", error);
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

export default UnpublishDocumentTool; 