import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { deleteDictionaryByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const DeleteDictionaryItemTool = CreateUmbracoTool(
  "delete-dictionary-item",
  "Deletes a dictionary item by Id",
  deleteDictionaryByIdParams.shape,
  async ({ id }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      var response = await client.deleteDictionaryById(id);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error creating dictionary item:", error);
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

export default DeleteDictionaryItemTool;
