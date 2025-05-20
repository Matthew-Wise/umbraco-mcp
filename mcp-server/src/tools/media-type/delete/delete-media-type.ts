import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { deleteMediaTypeByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const DeleteMediaTypeTool = CreateUmbracoTool(
  "delete-media-type",
  "Deletes a media type by Id",
  deleteMediaTypeByIdParams.shape,
  async ({ id }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.deleteMediaTypeById(id);

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

export default DeleteMediaTypeTool; 