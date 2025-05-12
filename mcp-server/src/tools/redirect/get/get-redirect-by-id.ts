import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getRedirectManagementByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetRedirectByIdTool = CreateUmbracoTool(
  "get-redirect-by-id",
  `Gets a specific redirect by its ID.
  Parameters:
  - id: The unique identifier of the redirect (string)
  
  Returns the redirect details.
  
  Example response:
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "sourceUrl": "/old-page",
    "destinationUrl": "/new-page",
    "statusCode": 301,
    "isEnabled": true,
    "createdAt": "2024-03-20T10:00:00Z",
    "updatedAt": "2024-03-20T10:00:00Z"
  }`,
  getRedirectManagementByIdParams.shape,
  async ({ id }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getRedirectManagementById(id);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting redirect:", error);
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

export default GetRedirectByIdTool; 