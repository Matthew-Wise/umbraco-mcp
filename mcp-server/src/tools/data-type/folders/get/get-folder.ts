import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getDataTypeFolderByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetDataTypeFolderTool = CreateUmbracoTool(
  "get-data-type-folder",
  "Gets a data type folder by Id",
  getDataTypeFolderByIdParams.shape,
  async ({ id }) => {
    const client = UmbracoManagementClient.getClient();
    var response = await client.getDataTypeFolderById(id);

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

export default GetDataTypeFolderTool;
