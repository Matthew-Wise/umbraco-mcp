import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getItemMemberTypeQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetMemberTypesByIdArrayTool = CreateUmbracoTool(
  "get-member-types-by-id-array",
  "Gets member types by IDs (or empty array if no IDs are provided)",
  getItemMemberTypeQueryParams.shape,
  async (params: { id?: string[] }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getItemMemberType(params);

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

export default GetMemberTypesByIdArrayTool; 