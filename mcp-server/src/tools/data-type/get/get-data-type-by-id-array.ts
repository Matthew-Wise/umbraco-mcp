import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getItemDataTypeQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetDataTypesByIdArrayTool = CreateUmbracoTool(
  "get-data-types-by-id-array",
  "Gets data types by IDs (or empty array if no IDs are provided)",
  getItemDataTypeQueryParams.shape,
  async (params) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getItemDataType(params);
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

export default GetDataTypesByIdArrayTool; 