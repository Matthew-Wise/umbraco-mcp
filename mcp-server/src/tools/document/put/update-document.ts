import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { putDocumentByIdParams, putDocumentByIdBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { z } from "zod";

const UpdateDocumentTool = CreateUmbracoTool(
  "update-document",
  `Updates a document by Id
  Always read the current document value first and only update the required values.
  Don't miss any properties from the original document that you are updating`,
  {
    id: putDocumentByIdParams.shape.id,
    data: z.object(putDocumentByIdBody.shape),
  },
  async (model: { id: string; data: any }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.putDocumentById(model.id, model.data);
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

export default UpdateDocumentTool; 