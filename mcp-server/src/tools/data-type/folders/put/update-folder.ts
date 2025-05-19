import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { putDataTypeFolderByIdParams, putDataTypeFolderByIdBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { z } from "zod";

const UpdateDataTypeFolderTool = CreateUmbracoTool(
  "update-data-type-folder",
  "Updates a data type folder by Id",
  {
    id: putDataTypeFolderByIdParams.shape.id,
    data: z.object(putDataTypeFolderByIdBody.shape),
  },
  async (model: { id: string; data: { name: string } }) => {
    const client = UmbracoManagementClient.getClient();
    var response = await client.putDataTypeFolderById(model.id, model.data);

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

export default UpdateDataTypeFolderTool; 