import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { deleteDocumentBlueprintByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const DeleteDocumentBlueprintTool = CreateUmbracoTool(
  "delete-document-blueprint",
  "Deletes a document blueprint by Id",
  deleteDocumentBlueprintByIdParams.shape,
  async ({ id }) => {
    const client = UmbracoManagementClient.getClient();
    var response = await client.deleteDocumentBlueprintById(id);
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

export default DeleteDocumentBlueprintTool; 