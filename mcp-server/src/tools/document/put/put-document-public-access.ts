import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { putDocumentByIdPublicAccessParams, putDocumentByIdPublicAccessBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { z } from "zod";

const PutDocumentPublicAccessTool = CreateUmbracoTool(
  "put-document-public-access",
  "Updates public access settings for a document by Id.",
  {
    id: putDocumentByIdPublicAccessParams.shape.id,
    data: z.object(putDocumentByIdPublicAccessBody.shape),
  },
  async (model: { id: string; data: any }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.putDocumentByIdPublicAccess(
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

export default PutDocumentPublicAccessTool; 