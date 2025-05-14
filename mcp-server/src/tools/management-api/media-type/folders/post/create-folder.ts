import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { CreateFolderRequestModel } from "@/umb-management-api/schemas/index.js";
import { postMediaTypeFolderBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const CreateMediaTypeFolderTool = CreateUmbracoTool(
  "create-media-type-folder",
  "Creates a new media type folder",
  postMediaTypeFolderBody.shape,
  async (model: CreateFolderRequestModel) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.postMediaTypeFolder(model);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error creating media type folder:", error);
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

export default CreateMediaTypeFolderTool; 