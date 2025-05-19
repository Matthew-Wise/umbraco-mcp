import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { postMediaTypeAvailableCompositionsBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetMediaTypeAvailableCompositionsTool = CreateUmbracoTool(
  "get-media-type-available-compositions",
  "Gets the available compositions for a media type",
  postMediaTypeAvailableCompositionsBody.shape,
  async (model) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.postMediaTypeAvailableCompositions(model);

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

export default GetMediaTypeAvailableCompositionsTool; 