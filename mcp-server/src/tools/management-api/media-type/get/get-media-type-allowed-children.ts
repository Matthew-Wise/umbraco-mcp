import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getMediaTypeByIdAllowedChildrenParams, getMediaTypeByIdAllowedChildrenQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

// Combine both parameter schemas
const paramSchema = getMediaTypeByIdAllowedChildrenParams.merge(getMediaTypeByIdAllowedChildrenQueryParams);

const GetMediaTypeAllowedChildrenTool = CreateUmbracoTool(
  "get-media-type-allowed-children",
  "Gets the media types that are allowed as children of a media type",
  paramSchema.shape,
  async (model) => {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getMediaTypeByIdAllowedChildren(model.id, {
        skip: model.skip,
        take: model.take
      });

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error getting allowed media type children:", error);
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

export default GetMediaTypeAllowedChildrenTool; 