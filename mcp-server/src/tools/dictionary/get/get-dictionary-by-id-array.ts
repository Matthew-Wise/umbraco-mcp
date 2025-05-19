import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getItemDictionaryQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetDictionaryByIdArrayTool = CreateUmbracoTool(
  "get-dictionary-by-id-array",
  "Gets dictionary items by IDs (or empty array if no IDs are provided)",
  getItemDictionaryQueryParams.shape,
  async (params) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getItemDictionary(params);
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

export default GetDictionaryByIdArrayTool; 