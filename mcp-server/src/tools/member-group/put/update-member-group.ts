import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { UpdateMemberGroupRequestModel } from "@/umb-management-api/schemas/index.js";
import {
  putMemberGroupByIdBody,
  putMemberGroupByIdParams,
} from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { z } from "zod";

const UpdateMemberGroupTool = CreateUmbracoTool(
  "update-member-group",
  "Updates a member group by Id",
  {
    id: putMemberGroupByIdParams.shape.id,
    data: z.object(putMemberGroupByIdBody.shape),
  },
  async (model: { id: string; data: UpdateMemberGroupRequestModel }) => {
    const client = UmbracoManagementClient.getClient();
    var response = await client.putMemberGroupById(model.id, model.data);

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

export default UpdateMemberGroupTool; 