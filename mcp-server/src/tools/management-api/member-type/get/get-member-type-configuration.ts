import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";

const GetMemberTypeConfigurationTool = CreateUmbracoTool(
  "get-member-type-configuration",
  "Gets the configuration for member types",
  {},
  async () => {
    try {
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
    } catch (error) {
      console.error("Error getting member type configuration:", error);
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${error}`,
          },
        ],
      };
    }
  }
);

export default GetMemberTypeConfigurationTool; 