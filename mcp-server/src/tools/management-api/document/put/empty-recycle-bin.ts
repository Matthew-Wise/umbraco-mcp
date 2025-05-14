import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";

const EmptyRecycleBinTool = CreateUmbracoTool(
  "empty-recycle-bin",
  "Empties the document recycle bin.",
  {},
  async () => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.deleteRecycleBinDocument();
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error emptying recycle bin:", error);
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

export default EmptyRecycleBinTool; 