import { UmbracoManagementClient } from "@umb-management-client";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import {
  postDocumentByIdPublicAccessParams,
  postDocumentByIdPublicAccessBody,
} from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { z } from "zod";

const PostDocumentPublicAccessTool = CreateUmbracoTool(
  "post-document-public-access",
  "Adds public access settings to a document by Id.",
  {
    id: postDocumentByIdPublicAccessParams.shape.id,
    data: z.object(postDocumentByIdPublicAccessBody.shape),
  },
  async (model: { id: string; data: any }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.postDocumentByIdPublicAccess(
      model.id,
      model.data
    );
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

export default PostDocumentPublicAccessTool;
