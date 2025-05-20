import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";

const EmptyRecycleBinTool = CreateUmbracoTool(
  "empty-media-recycle-bin",
  "Empties the media recycle bin.",
  {},
  async () => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.deleteRecycleBinMedia();
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

export default EmptyRecycleBinTool; 