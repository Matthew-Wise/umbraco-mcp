import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { postDocumentByIdPublicAccessParams, postDocumentByIdPublicAccessBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { z } from "zod";

const PostDocumentPublicAccessTool = CreateUmbracoTool(
  "post-document-public-access",
  "Adds public access settings to a document by Id.",
  {
    id: postDocumentByIdPublicAccessParams.shape.id,
    data: z.object(postDocumentByIdPublicAccessBody.shape)
  },
  async (model: { id: string; data: any }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.postDocumentByIdPublicAccess(model.id, model.data);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error adding document public access:", error);
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

export default PostDocumentPublicAccessTool; 