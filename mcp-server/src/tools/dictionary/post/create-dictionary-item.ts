import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { CreateDictionaryItemRequestModel } from "@/umb-management-api/schemas/index.js";
import { postDictionaryBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const CreateDictionaryItemTool = CreateUmbracoTool(
  "create-dictionary",
  "Creates a new dictionary item",
  postDictionaryBody.shape,
  async (model: CreateDictionaryItemRequestModel) => {
    const client = UmbracoManagementClient.getClient();
    var response = await client.postDictionary(model);

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

export default CreateDictionaryItemTool;
