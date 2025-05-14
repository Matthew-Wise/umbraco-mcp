import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { postMemberBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const CreateMemberTool = CreateUmbracoTool(
  "create-member",
  `Creates a member in Umbraco.
  Use this endpoint to create new members with the specified properties and groups.`,
  postMemberBody.shape,
  async (model) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.postMember(model);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error creating member:", error);
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

export default CreateMemberTool;
