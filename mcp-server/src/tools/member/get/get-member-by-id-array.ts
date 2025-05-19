import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getItemMemberQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetMembersByIdArrayTool = CreateUmbracoTool(
  "get-members-by-id-array",
  "Gets members by IDs (or empty array if no IDs are provided)",
  getItemMemberQueryParams.shape,
  async (params) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getItemMember(params);
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

export default GetMembersByIdArrayTool;
