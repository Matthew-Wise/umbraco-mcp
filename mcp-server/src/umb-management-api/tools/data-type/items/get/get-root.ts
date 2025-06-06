import { UmbracoManagementClient } from "@umb-management-client";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { GetTreeDataTypeRootParams } from "@/umb-management-api/schemas/index.js";
import { getTreeDataTypeRootQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetDataTypeRootTool = CreateUmbracoTool(
  "get-data-type-root",
  "Gets the root level of the data type and data type folders in the tree. Use get-all-data-types instead unless you specifically need only root level items.",
  getTreeDataTypeRootQueryParams.shape,
  async (params: GetTreeDataTypeRootParams) => {
    const client = UmbracoManagementClient.getClient();
    var response = await client.getTreeDataTypeRoot(params);
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

export default GetDataTypeRootTool;
