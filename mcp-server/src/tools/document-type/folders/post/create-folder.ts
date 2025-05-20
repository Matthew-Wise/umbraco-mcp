import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { CreateFolderRequestModel } from "@/umb-management-api/schemas/index.js";
import { postDocumentTypeFolderBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const CreateDocumentTypeFolderTool = CreateUmbracoTool(
  "create-document-type-folder",
  "Creates a new document type folder",
  postDocumentTypeFolderBody.shape,
  async (model: CreateFolderRequestModel) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.postDocumentTypeFolder(model);

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

export default CreateDocumentTypeFolderTool; 