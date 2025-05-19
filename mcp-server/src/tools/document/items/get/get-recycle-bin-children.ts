import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getRecycleBinDocumentChildrenQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetRecycleBinDocumentChildrenTool = CreateUmbracoTool(
  "get-recycle-bin-document-children",
  "Gets child items for a document in the recycle bin.",
  getRecycleBinDocumentChildrenQueryParams.shape,
  async (params) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getRecycleBinDocumentChildren(params);
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

export default GetRecycleBinDocumentChildrenTool; 