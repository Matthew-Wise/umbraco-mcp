import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { putDocumentByIdDomainsParams, putDocumentByIdDomainsBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { z } from "zod";

const PutDocumentDomainsTool = CreateUmbracoTool(
  "put-document-domains",
  `Updates the domains assigned to a document by Id. Default value of the defaultIsoCode is null. 
  Domain isoCode in the domains array should be in the format of 'en-US' amd be a valid domain name from the Umbraco instance.`,
  {
    id: putDocumentByIdDomainsParams.shape.id,
    data: z.object(putDocumentByIdDomainsBody.shape),
  },
  async (model: { id: string; data: any }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.putDocumentByIdDomains(model.id, model.data);
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

export default PutDocumentDomainsTool; 