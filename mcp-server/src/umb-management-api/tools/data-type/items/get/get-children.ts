import { UmbracoManagementClient } from "@umb-management-client";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getTreeDataTypeChildrenQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetDataTypeChildrenTool = CreateUmbracoTool(
  "get-data-type-children",
  "Gets the children data types or data type folders by the parent id. Use get-all-data-types instead unless you specifically need only child level items for a specific folder.",
  getTreeDataTypeChildrenQueryParams.shape,
  async (params) => {
    const client = UmbracoManagementClient.getClient();
    var response = await client.getTreeDataTypeChildren(params);

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

export default GetDataTypeChildrenTool;
