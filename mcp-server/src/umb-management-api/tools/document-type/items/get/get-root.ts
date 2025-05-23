import { UmbracoManagementClient } from "@umb-management-client";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { GetTreeDocumentTypeRootParams } from "@/umb-management-api/schemas/index.js";
import { getTreeDocumentTypeRootQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetDocumentTypeRootTool = CreateUmbracoTool(
  "get-document-type-root",
  "Gets the root level of the document type tree. Use get-all-document-types instead unless you specifically need only root level items.",
  getTreeDocumentTypeRootQueryParams.shape,
  async (params: GetTreeDocumentTypeRootParams) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getTreeDocumentTypeRoot(params);

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

export default GetDocumentTypeRootTool;
