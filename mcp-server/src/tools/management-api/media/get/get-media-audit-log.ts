import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getMediaByIdAuditLogParams, getMediaByIdAuditLogQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { z } from "zod";

const GetMediaAuditLogTool = CreateUmbracoTool(
  "get-media-audit-log",
  "Fetches the audit log for a media item by Id.",
  {
    id: getMediaByIdAuditLogParams.shape.id,
    data: z.object(getMediaByIdAuditLogQueryParams.shape),
  },
  async (model: { id: string; data: any }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getMediaByIdAuditLog(model.id, model.data);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error fetching media audit log:", error);
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

export default GetMediaAuditLogTool; 