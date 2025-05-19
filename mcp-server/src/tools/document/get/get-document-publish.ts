import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getDocumentByIdPublishedParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetDocumentPublishTool = CreateUmbracoTool(
  "get-document-publish",
  "Gets the published state of a document by Id.",
  getDocumentByIdPublishedParams.shape,
  async ({ id }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getDocumentByIdPublished(id);
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

export default GetDocumentPublishTool; 