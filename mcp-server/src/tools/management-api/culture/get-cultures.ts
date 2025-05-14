import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { GetCultureParams } from "@/umb-management-api/schemas/index.js";
import { getCultureQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetCulturesTool = CreateUmbracoTool(
  "get-culture",
  "Retrieves a paginated list of cultures that Umbraco can be configured to use",
  getCultureQueryParams.shape,
  async (params: GetCultureParams) => {
    const client = UmbracoManagementClient.getClient();
    var response = await client.getCulture(params);
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

export default GetCulturesTool;
