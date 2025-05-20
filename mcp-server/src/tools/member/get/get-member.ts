import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getMemberByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetMemberTool = CreateUmbracoTool(
  "get-member",
  "Gets a member by Id",
  getMemberByIdParams.shape,
  async ({ id }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getMemberById(id);

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

export default GetMemberTool;
