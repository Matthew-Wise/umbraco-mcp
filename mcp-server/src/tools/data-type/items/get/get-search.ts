import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { GetItemDataTypeSearchParams } from "@/umb-management-api/schemas/index.js";
import { getItemDataTypeSearchQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetDataTypeSearchTool = CreateUmbracoTool(
  "get-data-type-search",
  "Searches the data type tree for a data type by name. It does NOT allow for searching for data type folders.",
  getItemDataTypeSearchQueryParams.shape,
  async (params: GetItemDataTypeSearchParams) => {
    const client = UmbracoManagementClient.getClient();
    var response = await client.getItemDataTypeSearch(params);

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

export default GetDataTypeSearchTool;
