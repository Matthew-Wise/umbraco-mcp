import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";

const GetAllRedirectsTool = CreateUmbracoTool(
  "get-all-redirects",
  `Gets all redirects from the Umbraco server.
  Returns a list of redirects with their details.
  
  Example response:
  {
    "items": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "sourceUrl": "/old-page",
        "destinationUrl": "/new-page",
        "statusCode": 301,
        "isEnabled": true,
        "createdAt": "2024-03-20T10:00:00Z",
        "updatedAt": "2024-03-20T10:00:00Z"
      }
    ],
    "total": 1
  }`,
  {},
  async () => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getRedirectManagement();

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting redirects:", error);
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

export default GetAllRedirectsTool; 