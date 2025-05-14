import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getMediaTypeByIdCompositionReferencesParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetMediaTypeCompositionReferencesTool = CreateUmbracoTool(
  "get-media-type-composition-references",
  "Gets the composition references for a media type",
  getMediaTypeByIdCompositionReferencesParams.shape,
  async ({ id }) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getMediaTypeByIdCompositionReferences(id);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting media type composition references:", error);
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

export default GetMediaTypeCompositionReferencesTool; 