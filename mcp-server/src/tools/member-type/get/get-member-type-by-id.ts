import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getMemberTypeByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetMemberTypeByIdTool = CreateUmbracoTool(
  "get-member-type-by-id",
  "Gets a member type by id",
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

export default GetMemberTypeByIdTool; 