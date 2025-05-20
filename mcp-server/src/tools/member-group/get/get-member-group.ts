import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getMemberGroupByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetMemberGroupTool = CreateUmbracoTool(
  "get-member-group",
  "Gets a member group by Id",
  getMemberGroupByIdParams.shape,
  async ({ id }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getMemberGroupById(id);

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

export default GetMemberGroupTool; 