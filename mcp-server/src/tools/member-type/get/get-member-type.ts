import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getMemberTypeByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetMemberTypeTool = CreateUmbracoTool(
  "get-member-type",
  "Gets a member type by Id",
  getMemberTypeByIdParams.shape,
  async ({ id }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getMemberTypeById(id);

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

export default GetMemberTypeTool; 