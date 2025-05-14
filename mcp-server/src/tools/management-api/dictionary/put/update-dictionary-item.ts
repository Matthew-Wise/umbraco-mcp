import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { UpdateDictionaryItemRequestModel } from "@/umb-management-api/schemas/index.js";
import {
  putDictionaryByIdBody,
  putDictionaryByIdParams,
} from "@/umb-management-api/umbracoManagementAPI.zod.js";

import { z } from "zod";

const UpdateDictionaryItemTool = CreateUmbracoTool(
  "update-dictionary-item",
  "Updates a dictionary item by Id",
  {
    id: putDictionaryByIdParams.shape.id,
    data: z.object(putDictionaryByIdBody.shape),
  },
  async (model: { id: string; data: UpdateDictionaryItemRequestModel }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      var response = await client.putDictionaryById(model.id, model.data);

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

export default UpdateDictionaryItemTool;
