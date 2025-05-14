import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";

const GetMemberConfigurationTool = CreateUmbracoTool(
  "get-member-configuration",
  "Gets member configuration including reserved field names",
  {},
  async () => {
    try {
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
    } catch (error) {
      console.error("Error getting member configuration:", error);
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

export default GetMemberConfigurationTool;
