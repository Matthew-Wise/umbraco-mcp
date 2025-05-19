import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { getPropertyTypeIsUsedQueryParams } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const GetPropertyTypeIsUsedTool = CreateUmbracoTool(
  "get-property-type-is-used",
  "Checks if a property type is used within Umbraco",
  getPropertyTypeIsUsedQueryParams.shape,
  async ({ contentTypeId, propertyAlias }) => {
    const client = UmbracoManagementClient.getClient();
    const response = await client.getPropertyTypeIsUsed({
      contentTypeId,
      propertyAlias,
    });

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

export default GetPropertyTypeIsUsedTool;
