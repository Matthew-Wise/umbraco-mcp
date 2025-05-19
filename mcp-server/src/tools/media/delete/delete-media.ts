import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { deleteMediaByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const DeleteMediaTool = CreateUmbracoTool(
  "delete-media",
  "Deletes a media item by Id",
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

export default DeleteMediaTool; 