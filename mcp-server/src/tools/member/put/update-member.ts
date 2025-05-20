import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { UpdateMemberRequestModel } from "@/umb-management-api/schemas/index.js";
import {
  putMemberByIdBody,
  putMemberByIdParams,
} from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { z } from "zod";

const UpdateMemberTool = CreateUmbracoTool(
  "update-member",
  "Updates a member by Id",
  {
    id: putMemberByIdParams.shape.id,
    data: z.object(putMemberByIdBody.shape),
  },
  async (model: { id: string; data: UpdateMemberRequestModel }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.putMemberById(model.id, model.data);

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

export default UpdateMemberTool;
