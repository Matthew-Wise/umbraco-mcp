import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";

const GetServerConfigurationTool = CreateUmbracoTool(
  "get-server-configuration",
  `Gets the server configuration settings.
  Returns an object containing:
  - allowPasswordReset: Whether password reset is allowed (boolean)
  - versionCheckPeriod: The period between version checks in minutes (number)
  - allowLocalLogin: Whether local login is allowed (boolean)
  
  Example response:
  {
    "allowPasswordReset": true,
    "versionCheckPeriod": 1440,
    "allowLocalLogin": true
  }`,
  {},
  async () => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getServerConfiguration();

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting server configuration:", error);
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

export default GetServerConfigurationTool; 