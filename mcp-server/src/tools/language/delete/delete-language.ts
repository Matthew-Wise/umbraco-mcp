import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { deleteLanguageByIsoCodeParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const DeleteLanguageTool = CreateUmbracoTool(
  "delete-language",
  "Deletes a language by ISO code",
  deleteLanguageByIsoCodeParams.shape,
  async ({ isoCode }: { isoCode: string }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.deleteLanguageByIsoCode(isoCode);
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

export default DeleteLanguageTool; 