import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";

const GetMemberTypeConfigurationTool = CreateUmbracoTool(
  "get-member-type-configuration",
  "Gets the configuration for member types",
  {},
  async () => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getMemberTypeConfiguration();

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

export default GetMemberTypeConfigurationTool; 