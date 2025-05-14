import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";

const GetDocumentTypeConfigurationTool = CreateUmbracoTool(
  "get-document-type-configuration",
  "Gets the global configuration for document types",
  {},
  async () => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getDocumentTypeConfiguration();
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting document type configuration:", error);
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

export default GetDocumentTypeConfigurationTool; 