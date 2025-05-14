import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import {
  putDocumentTypeFolderByIdParams,
  putDocumentTypeFolderByIdBody,
} from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { z } from "zod";

const UpdateDocumentTypeFolderTool = CreateUmbracoTool(
  "update-document-type-folder",
  "Updates a document type folder by Id",
  {
    id: putDocumentTypeFolderByIdParams.shape.id,
    data: z.object(putDocumentTypeFolderByIdBody.shape),
  },
  async (model: { id: string; data: { name: string } }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.putDocumentTypeFolderById(model.id, model.data);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error updating document type folder:", error);
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

export default UpdateDocumentTypeFolderTool; 