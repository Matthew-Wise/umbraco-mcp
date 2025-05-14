import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getTreeDocumentBlueprintAncestorsQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetDocumentBlueprintAncestorsTool = CreateUmbracoTool(
  "get-document-blueprint-ancestors",
  "Gets the ancestors of a document blueprint by Id",
  getTreeDocumentBlueprintAncestorsQueryParams.shape,
  async (params) => {
    try {
      const client = UmbracoManagementClient.getClient();
      var response = await client.getTreeDocumentBlueprintAncestors(params);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting document blueprint ancestors:", error);
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

export default GetDocumentBlueprintAncestorsTool; 