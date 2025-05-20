import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { postMediaValidateBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const ValidateMediaTool = CreateUmbracoTool(
  "validate-media",
  "Validates a media item using the Umbraco API.",
  postMediaValidateBody.shape,
  async (model) => {
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
  }
);

export default ValidateMediaTool; 