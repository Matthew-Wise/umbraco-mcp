import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { postMediaValidateBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const ValidateMediaTool = CreateUmbracoTool(
  "validate-media",
  "Validates a media item using the Umbraco API.",
  postMediaValidateBody.shape,
  async (model) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.postMediaValidate(model);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error validating media:", error);
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

export default ValidateMediaTool; 