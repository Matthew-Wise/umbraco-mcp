import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { putDocumentSortBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";

const SortDocumentTool = CreateUmbracoTool(
  "sort-document",
  "Sorts the order of documents under a parent.",
  putDocumentSortBody.shape,
  async (model: any) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.putDocumentSort(model);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error sorting documents:", error);
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

export default SortDocumentTool; 