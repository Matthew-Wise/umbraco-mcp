import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { postLanguageBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const CreateLanguageTool = CreateUmbracoTool(
  "create-language",
  "Creates a new language",
  postLanguageBody.shape,
  async (model) => {
    const client = UmbracoManagementClient.getClient();
    const validated = postLanguageBody.parse(model);
    await client.postLanguage(validated);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            { success: true, isoCode: validated.isoCode },
            null,
            2
          ),
        },
      ],
    };
  }
);

export default CreateLanguageTool; 