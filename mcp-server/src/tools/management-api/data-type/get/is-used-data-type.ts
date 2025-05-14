import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getDataTypeByIdIsUsedParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const IsUsedDataTypeTool = CreateUmbracoTool(
  "is-used-data-type",
  "Checks if a data type is used within Umbraco",
  getDataTypeByIdIsUsedParams.shape,
  async ({ id }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      var response = await client.getDataTypeByIdIsUsed(id);

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

export default IsUsedDataTypeTool;
