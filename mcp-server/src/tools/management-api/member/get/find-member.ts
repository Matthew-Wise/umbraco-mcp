import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { GetFilterMemberParams } from "@/umb-management-api/schemas/index.js";
import { getFilterMemberQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const FindMemberTool = CreateUmbracoTool(
  "find-member",
  `Finds members by various filter criteria`,
  getFilterMemberQueryParams.shape,
  async (model: GetFilterMemberParams) => {
    try {
      const client = UmbracoManagementClient.getClient();
      var response = await client.getFilterMember(model);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error finding members:", error);
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

export default FindMemberTool;
