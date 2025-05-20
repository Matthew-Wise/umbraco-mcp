import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";

const GetMemberConfigurationTool = CreateUmbracoTool(
  "get-member-configuration",
  "Gets member configuration including reserved field names",
  {},
  async () => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getMemberConfiguration();
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

export default GetMemberConfigurationTool;
