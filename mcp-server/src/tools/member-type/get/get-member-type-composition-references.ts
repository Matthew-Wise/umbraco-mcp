import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getMemberTypeByIdCompositionReferencesParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetMemberTypeCompositionReferencesTool = CreateUmbracoTool(
  "get-member-type-composition-references",
  "Gets the composition references for a member type",
  getMemberTypeByIdCompositionReferencesParams.shape,
  async ({ id }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getMemberTypeByIdCompositionReferences(id);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting member type composition references:", error);
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

export default GetMemberTypeCompositionReferencesTool; 