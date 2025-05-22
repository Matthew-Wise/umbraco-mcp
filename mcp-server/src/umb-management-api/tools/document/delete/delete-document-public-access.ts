import { UmbracoManagementClient } from "@umb-management-client";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { deleteDocumentByIdPublicAccessParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const DeleteDocumentPublicAccessTool = CreateUmbracoTool(
  "delete-document-public-access",
  "Removes public access settings from a document by Id.",
  deleteDocumentByIdPublicAccessParams.shape,
  async ({ id }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.deleteDocumentByIdPublicAccess(id);
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

export default DeleteDocumentPublicAccessTool;
