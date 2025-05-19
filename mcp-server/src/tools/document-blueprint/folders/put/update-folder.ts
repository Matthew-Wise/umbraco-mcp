import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { putDocumentBlueprintFolderByIdParams, putDocumentBlueprintFolderByIdBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { z } from "zod";

const UpdateDocumentBlueprintFolderTool = CreateUmbracoTool(
  "update-document-blueprint-folder",
  "Updates a document blueprint folder",
  {
    id: putDocumentBlueprintFolderByIdParams.shape.id,
    data: z.object(putDocumentBlueprintFolderByIdBody.shape),
  },
  async ({ id, data }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.putDocumentBlueprintFolderById(id, data);
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

export default UpdateDocumentBlueprintFolderTool; 