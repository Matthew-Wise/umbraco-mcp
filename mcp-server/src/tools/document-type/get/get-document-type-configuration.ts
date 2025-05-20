import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";

const GetDocumentTypeConfigurationTool = CreateUmbracoTool(
  "get-document-type-configuration",
  "Gets the global configuration for document types",
  {},
  async () => {
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
  }
);

export default GetDocumentTypeConfigurationTool; 