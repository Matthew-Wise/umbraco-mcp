import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { postDocumentBlueprintBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const CreateDocumentBlueprintTool = CreateUmbracoTool(
  "create-document-blueprint",
  "Creates a new document blueprint",
  postDocumentBlueprintBody.shape,
  async (model) => {
    try {
      const client = UmbracoManagementClient.getClient();
      var response = await client.postDocumentBlueprint(model);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error creating document blueprint:", error);
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

export default CreateDocumentBlueprintTool; 