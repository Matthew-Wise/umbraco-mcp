import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { deleteMediaTypeFolderByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const DeleteMediaTypeFolderTool = CreateUmbracoTool(
  "delete-media-type-folder",
  "Deletes a media type folder by Id",
  deleteMediaTypeFolderByIdParams.shape,
  async ({ id }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.deleteMediaTypeFolderById(id);

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

export default DeleteMediaTypeFolderTool; 