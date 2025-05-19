import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { deleteMediaByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const DeleteFromRecycleBinTool = CreateUmbracoTool(
  "delete-media-from-recycle-bin",
  "Deletes a media item from the recycle bin by Id.",
  deleteMediaByIdParams.shape,
  async ({ id }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.deleteMediaById(id);
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

export default DeleteFromRecycleBinTool; 