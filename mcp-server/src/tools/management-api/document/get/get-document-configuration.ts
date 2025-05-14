import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getDocumentConfigurationResponse } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetDocumentConfigurationTool = CreateUmbracoTool(
  "get-document-configuration",
  "Gets the document configuration for the Umbraco instance.",
  {},
  async () => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getDocumentConfiguration();
      // Optionally validate response
      getDocumentConfigurationResponse.parse(response);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting document configuration:", error);
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

export default GetDocumentConfigurationTool; 