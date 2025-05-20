import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { putMediaByIdParams, putMediaByIdBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { z } from "zod";

const UpdateMediaTool = CreateUmbracoTool(
  "update-media",
  `Updates a media item by Id
  Always read the current media value first and only update the required values.
  Don't miss any properties from the original media that you are updating.
  This cannot be used for moving media to a new foler. Use the move endpoint to do that`,
  {
    id: putMediaByIdParams.shape.id,
    data: z.object(putMediaByIdBody.shape),
  },
  async (model: { id: string; data: any }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.putMediaById(model.id, model.data);
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

export default UpdateMediaTool; 