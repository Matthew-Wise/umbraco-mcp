import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { CreateMemberGroupRequestModel } from "@/umb-management-api/schemas/index.js";
import { postMemberGroupBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const CreateMemberGroupTool = CreateUmbracoTool(
  "create-member-group",
  "Creates a new member group",
  postMemberGroupBody.shape,
  async (model: CreateMemberGroupRequestModel) => {
    try {
      const client = UmbracoManagementClient.getClient();
      var response = await client.postMemberGroup(model);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error creating member group:", error);
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

export default CreateMemberGroupTool; 