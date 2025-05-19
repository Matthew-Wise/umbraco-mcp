import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { deleteTemporaryFileByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const DeleteTemporaryFileTool = CreateUmbracoTool(
  "delete-temporary-file",
  "Deletes a temporary file by Id",
  deleteTemporaryFileByIdParams.shape,
  async ({ id }) => {
    const client = UmbracoManagementClient.getClient();
    await client.deleteTemporaryFileById(id);

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({ id }),
        },
      ],
    };
  }
);

export default DeleteTemporaryFileTool; 