import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getDocumentByIdAuditLogParams, getDocumentByIdAuditLogQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { z } from "zod";

const GetDocumentAuditLogTool = CreateUmbracoTool(
  "get-document-audit-log",
  "Fetches the audit log for a document by Id.",
  {
    id: getDocumentByIdAuditLogParams.shape.id,
    data: z.object(getDocumentByIdAuditLogQueryParams.shape),
  },
  async (model: { id: string; data: any }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getDocumentByIdAuditLog(model.id, model.data);
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

export default GetDocumentAuditLogTool; 