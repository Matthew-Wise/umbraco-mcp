import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { UpdateMemberTypeRequestModel } from "@/umb-management-api/schemas/index.js";
import {
  putMemberTypeByIdBody,
  putMemberTypeByIdParams,
} from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { z } from "zod";

const UpdateMemberTypeTool = CreateUmbracoTool(
  "update-member-type",
  "Updates a member type by id",
  {
    id: putMemberTypeByIdParams.shape.id,
    data: z.object(putMemberTypeByIdBody.shape),
  },
  async (model: { id: string; data: UpdateMemberTypeRequestModel }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.putMemberTypeById(model.id, model.data);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error updating member type:", error);
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

export default UpdateMemberTypeTool; 