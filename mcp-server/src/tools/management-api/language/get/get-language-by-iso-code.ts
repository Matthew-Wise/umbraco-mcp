import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getLanguageByIsoCodeParams, getLanguageByIsoCodeResponse } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetLanguageByIsoCodeTool = CreateUmbracoTool(
    "get-language-by-iso-code",
    "Gets a language by ISO code",
    getLanguageByIsoCodeParams.shape,
    async (model) => {
      try {
        const client = UmbracoManagementClient.getClient();
        const params = getLanguageByIsoCodeParams.parse(model);
        const response = await client.getLanguageByIsoCode(params.isoCode);
        const validated = getLanguageByIsoCodeResponse.parse(response);
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(validated, null, 2),
            },
          ],
        };
      } catch (error) {
        console.error("Error in GetLanguageByIsoCodeTool:", error);
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

export default GetLanguageByIsoCodeTool; 