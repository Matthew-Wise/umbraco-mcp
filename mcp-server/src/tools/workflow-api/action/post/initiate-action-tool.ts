import { UmbracoWorkflowClient } from "@/clients/umbraco-workflow-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { InitiateWorkflowRequestModel } from "@/umb-workflow-api/schemas/index.js";
import { postActionInitiateBody } from "@/umb-workflow-api/umbracoWorkflowManagementAPI.zod.js";

const InitiateActionTool = CreateUmbracoTool(
  "initiate-workflow-action",
  `Initiates a workflow approval process for content changes before they are published. 
  This is the RECOMMENDED approach when content requires review/approval before going live. 
  The variant parameter should be the culture string (e.g., en-US) or use '*' for all cultures.`,
  postActionInitiateBody.shape,
  async (model: InitiateWorkflowRequestModel) => {
    try {
      const client = UmbracoWorkflowClient.getClient();

      const response = await client.postActionInitiate(model);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error("Error initiating workflow action:", error);
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

export default InitiateActionTool;
