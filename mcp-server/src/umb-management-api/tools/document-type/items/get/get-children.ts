import { UmbracoManagementClient } from "@umb-management-client";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { GetTreeDocumentTypeChildrenParams } from "@/umb-management-api/schemas/index.js";
import { getTreeDocumentTypeChildrenQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetDocumentTypeChildrenTool = CreateUmbracoTool(
  "get-document-type-children",
  "Gets the children of a document type. Use get-all-document-types instead unless you specifically need only child level items for a specific folder.",
  getTreeDocumentTypeChildrenQueryParams.shape,
  async (params: GetTreeDocumentTypeChildrenParams) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getTreeDocumentTypeChildren(params);

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

export default GetDocumentTypeChildrenTool;
