import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";

const GetServerUpgradeCheckTool = CreateUmbracoTool(
  "get-server-upgrade-check",
  `Checks the server upgrade status and requirements.
  Returns an object containing:
  - type: The type of upgrade information (string)
  - comment: A description or message about the upgrade (string)
  - url: A URL with more information about the upgrade (string)
  
  Example response:
  {
    "type": "UpgradeAvailable",
    "comment": "A new version of Umbraco is available",
    "url": "https://our.umbraco.com/download/releases/15.3.2"
  }`,
  {},
  async () => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getServerUpgradeCheck();

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

export default GetServerUpgradeCheckTool; 