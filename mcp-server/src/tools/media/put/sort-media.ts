import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { putMediaSortBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";

const SortMediaTool = CreateUmbracoTool(
  "sort-media",
  "Sorts the order of media items under a parent.",
  putMediaSortBody.shape,
  async (model: any) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.putMediaSort(model);
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

export default SortMediaTool; 