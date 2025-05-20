import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";
import { TemporaryFileResponseModel } from "@/umb-management-api/schemas/index.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export class TemporaryFileTestHelper {
  static async findTemporaryFiles(
    id: string
  ): Promise<TemporaryFileResponseModel[]> {
    try {
      const client = UmbracoManagementClient.getClient();
      const response = await client.getTemporaryFileById(id);
      return [response];
    } catch (error) {
      return [];
    }
  }

  static async cleanup(id: string): Promise<void> {
    try {
      const client = UmbracoManagementClient.getClient();
      await client.deleteTemporaryFileById(id);
    } catch (error) {
      // Ignore errors during cleanup
    }
  }

  static cleanFilePaths(response: CallToolResult) {
    response.content = response.content.map((r) => {
      let lines = (r.text as string).split("\n");
      const text = lines.shift();
      const jsonText = lines.join("\n");

      var obj = JSON.parse(jsonText);
      if (obj.cause) {
        obj.cause.path = "<image path>";
      }
      obj.path = "<image path>";
      obj.message = obj.message.replace(/["'].*["']/g, "<image path>");

      r.text = text + "\n" + JSON.stringify(obj, null, 2);
      return r;
    });

    return response;
  }
} 