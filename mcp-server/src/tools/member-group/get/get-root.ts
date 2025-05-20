import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getTreeMemberGroupRootQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetMemberGroupRootTool = CreateUmbracoTool(
  "get-member-group-root",
  "Gets the root level of the member group tree",
  getTreeMemberGroupRootQueryParams.shape,
  async (params) => {
    const client = UmbracoManagementClient.getClient();
    var response = await client.getTreeMemberGroupRoot(params);
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

export default GetMemberGroupRootTool; 