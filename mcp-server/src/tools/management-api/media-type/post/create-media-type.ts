import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { CreateMediaTypeRequestModel } from "@/umb-management-api/schemas/index.js";
import { postMediaTypeBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const CreateMediaTypeTool = CreateUmbracoTool(
  "create-media-type",
  "Creates a new media type",
  postMediaTypeBody.shape,
  async (model: CreateMediaTypeRequestModel) => {
    try {
      const client = UmbracoManagementClient.getClient();
      var response = await client.postMediaType(model);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error creating media type:", error);
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

export default CreateMediaTypeTool; 