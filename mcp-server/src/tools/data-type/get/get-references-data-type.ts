import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getDataTypeByIdReferencesParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetReferencesDataTypeTool = CreateUmbracoTool(
  "get-references-data-type",
  "Gets where a data type is used by Id",
  getDataTypeByIdReferencesParams.shape,
  async ({ id }) => {
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
  }
);

export default GetReferencesDataTypeTool;
