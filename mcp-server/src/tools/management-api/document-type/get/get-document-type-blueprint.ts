import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getDocumentTypeByIdBlueprintParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetDocumentTypeBlueprintTool = CreateUmbracoTool(
  "get-document-type-blueprint",
  "Gets the blueprints for a document type",
  getDocumentTypeByIdBlueprintParams.shape,
  async ({ id }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getDocumentTypeByIdBlueprint(id);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting document type blueprints:", error);
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

export default GetDocumentTypeBlueprintTool; 