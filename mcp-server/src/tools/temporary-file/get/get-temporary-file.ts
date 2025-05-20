import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getTemporaryFileByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetTemporaryFileTool = CreateUmbracoTool(
  "get-temporary-file",
  "Gets a temporary file by id",
  getTemporaryFileByIdParams.shape,
  async (params) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getTemporaryFileById(params.id);

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

export default GetTemporaryFileTool; 