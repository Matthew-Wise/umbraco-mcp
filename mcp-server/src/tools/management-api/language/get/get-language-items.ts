import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getItemLanguageQueryParams, getItemLanguageResponse } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetLanguageItemsTool = CreateUmbracoTool(
  "get-language-items",
  "Gets language items (optionally filtered by isoCode)",
  getItemLanguageQueryParams.shape,
  async (params) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getItemLanguage(params);
      const validated = getItemLanguageResponse.parse(response);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(validated),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting language items:", error);
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

export default GetLanguageItemsTool; 