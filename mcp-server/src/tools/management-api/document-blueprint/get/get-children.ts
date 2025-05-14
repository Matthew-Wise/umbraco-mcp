import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getTreeDocumentBlueprintChildrenQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetDocumentBlueprintChildrenTool = CreateUmbracoTool(
  "get-document-blueprint-children",
  "Gets the children of a document blueprint by Id",
  getTreeDocumentBlueprintChildrenQueryParams.shape,
  async (params) => {
    try {
      const client = UmbracoManagementClient.getClient();
      var response = await client.getTreeDocumentBlueprintChildren(params);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting document blueprint children:", error);
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

export default GetDocumentBlueprintChildrenTool; 