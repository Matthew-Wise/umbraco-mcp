import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { CreateUmbracoTool } from "@/helpers/create-umbraco-tool.js";
import { CreateDataTypeRequestModel } from "@/umb-management-api/schemas/index.js";
import { postDataTypeBody } from "@/umb-management-api/umbracoManagementAPI.zod.js";

const CreateDataTypeTool = CreateUmbracoTool(
  "create-data-type",
  "Creates a new data type",
  postDataTypeBody.shape,
  async (model: CreateDataTypeRequestModel) => {
    try {
      const client = UmbracoManagementClient.getClient();
      var response = await client.postDataType(model);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      console.error("Error creating data type:", error);
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

export default CreateDataTypeTool;
