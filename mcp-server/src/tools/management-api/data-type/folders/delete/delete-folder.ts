import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { deleteDataTypeFolderByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const DeleteDataTypeFolderTool = CreateUmbracoTool(
  "delete-data-type-folder",
  "Deletes a data type folder by Id",
  deleteDataTypeFolderByIdParams.shape,
  async ({ id }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      var response = await client.deleteDataTypeFolderById(id);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error creating data type:", error);
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

export default DeleteDataTypeFolderTool;
