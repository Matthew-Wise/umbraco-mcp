import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getDataTypeByIdReferencesParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetReferencesDataTypeTool = CreateUmbracoTool(
  "get-references-data-type",
  "Gets a data type by Id",
  getDataTypeByIdReferencesParams.shape,
  async ({ id }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      var response = await client.getDataTypeByIdReferences(id);

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

export default GetReferencesDataTypeTool;
