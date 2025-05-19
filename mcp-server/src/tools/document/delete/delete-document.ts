import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { deleteDocumentByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const DeleteDocumentTool = CreateUmbracoTool(
  "delete-document",
  "Deletes a document by Id",
  deleteDocumentByIdParams.shape,
  async ({ id }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.deleteDocumentById(id);
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

export default DeleteDocumentTool; 