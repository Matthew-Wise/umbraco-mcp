import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import {
  getDocumentTypeByIdAllowedChildrenParams,
  getDocumentTypeByIdAllowedChildrenQueryParams,
} from "@/umb-management-api/umbracoManagementAPI.zod.js";

// Combine both parameter schemas
const paramSchema = getDocumentTypeByIdAllowedChildrenParams.merge(
  getDocumentTypeByIdAllowedChildrenQueryParams
);

const GetDocumentTypeAllowedChildrenTool = CreateUmbracoTool(
  "get-document-type-allowed-children",
  "Gets the document types that are allowed as children of a document type",
  paramSchema.shape,
  async (model) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getDocumentTypeByIdAllowedChildren(model.id, {
      skip: model.skip,
      take: model.take,
    });

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

export default GetDocumentTypeAllowedChildrenTool; 