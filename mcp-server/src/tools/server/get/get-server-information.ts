import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";

const GetServerInformationTool = CreateUmbracoTool(
  "get-server-information",
  `Gets information about the Umbraco server.
  Returns an object containing:
  - version: The Umbraco version (string)
  - assemblyVersion: The assembly version (string)
  - baseUtcOffset: The server's UTC offset (string)
  - runtimeMode: The server's runtime mode, one of: 'BackofficeDevelopment', 'Development', 'Production' (string)
  
  Example response:
  {
    "version": "15.3.1",
    "assemblyVersion": "15.3.1.0",
    "baseUtcOffset": "-07:00:00",
    "runtimeMode": "BackofficeDevelopment"
  }`,
  {},
  async () => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getServerInformation();

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

export default GetServerInformationTool; 