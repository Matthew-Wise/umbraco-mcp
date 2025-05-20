import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { deleteDocumentTypeByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const DeleteDocumentTypeTool = CreateUmbracoTool(
  "delete-document-type",
  "Deletes a document type by Id",
  deleteDocumentTypeByIdParams.shape,
  async ({ id }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.deleteDocumentTypeById(id);

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

export default DeleteDocumentTypeTool; 