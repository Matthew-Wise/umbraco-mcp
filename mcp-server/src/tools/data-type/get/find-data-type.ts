import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { GetFilterDataTypeParams } from "@/umb-management-api/schemas/index.js";
import { getFilterDataTypeQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const FindDataTypeTool = CreateUmbracoTool(
  "find-data-type",
  "Finds a data type by Id or Name",
  getFilterDataTypeQueryParams.shape,
  async (model: GetFilterDataTypeParams) => {
    try {
      const client = UmbracoManagementClient.getClient();
      var response = await client.getFilterDataType(model);

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

export default FindDataTypeTool;
