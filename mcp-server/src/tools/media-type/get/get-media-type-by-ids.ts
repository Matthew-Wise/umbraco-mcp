import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getMediaTypeByIdParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";
import { z } from "zod";

const GetMediaTypeByIdsTool = CreateUmbracoTool(
  "get-media-type-by-ids",
  "Gets media types by ids",
  {
    ids: z.array(z.string()),
  },
  async ({ ids }: { ids: string[] }) => {
    const client = UmbracoManagementClient.getClient();
    const responses = await Promise.all(
      ids.map((id: string) => client.getMediaTypeById(id))
    );

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(responses),
        },
      ],
    };
  }
);

export default GetMediaTypeByIdsTool; 