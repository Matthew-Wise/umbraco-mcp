import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { postDocumentBlueprintFolderBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const CreateDocumentBlueprintFolderTool = CreateUmbracoTool(
  "create-document-blueprint-folder",
  "Creates a new document blueprint folder",
  postDocumentBlueprintFolderBody.shape,
  async (model) => {
    const client = UmbracoManagementClient.getClient();
    var response = await client.postDocumentBlueprintFolder(model);
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

export default CreateDocumentBlueprintFolderTool; 