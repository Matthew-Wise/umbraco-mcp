import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";

const GetRedirectStatusTool = CreateUmbracoTool(
  "get-redirect-status",
  `Gets the current status of redirect management.
  Returns information about whether redirects are enabled and other status details.
  
  Example response:
  {
    "isEnabled": true,
    "lastUpdated": "2024-03-20T10:00:00Z",
    "totalRedirects": 42,
    "status": "Active"
  }`,
  {},
  async () => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getRedirectManagementStatus();

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

export default GetRedirectStatusTool; 