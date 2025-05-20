import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { postRedirectManagementStatusQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const UpdateRedirectStatusTool = CreateUmbracoTool(
  "update-redirect-status",
  `Updates the status of redirect management.
  Parameters:
  - status: The new status, either "Enabled" or "Disabled" (string)
  
  Returns no content on success.`,
  postRedirectManagementStatusQueryParams.shape,
  async ({ status }) => {
    const client = UmbracoManagementClient.getClient();
    await client.postRedirectManagementStatus({ status });

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({ status }),
        },
      ],
    };
  }
);

export default UpdateRedirectStatusTool; 