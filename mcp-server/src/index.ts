import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import * as deliveryClient from "./api/umbraco/delivery/content/content.client.js";

// import * as delivery from "./api/umbraco/delivery/umbracoDeliveryAPI.js";
import * as deliverySchemas from "./api/umbraco/delivery/content/content.zod.js";
import axios from "axios";

// import * as management from "./api/umbraco/management/umbracoManagementAPI.js";
// import * as managementSchemas from "./api/umbraco/management/schemas/index.js";

axios.defaults.baseURL = "http://localhost:56472/";

const server = new McpServer({
  name: "umbraco-api-server",
  version: "1.0.0",
  capabilities: {
    tools: {},
  },
});

const client = deliveryClient.getContent();

server.tool(
  "get_content",
  "Gets content item(s) from a query",
  { input: deliverySchemas.getContent20QueryParams },
  async ({ input }) => {
    try {
      var parsed = deliverySchemas.getContent20QueryParams.parse(input);
      console.info("callTool", parsed);

      const response = await client.getContent20(parsed);
      console.log(response);
      return {
        content: [
          { type: "text", text: `Content: ${JSON.stringify(response.data)}` },
          // http status code
          { type: "text", text: `HTTP Status Code: ${response.status}` },
        ],
      };
    } catch (error) {
      console.error(`Error:`, error);
      if (axios.isAxiosError(error) && error.response) {
        return {
          content: [
            {
              type: "text",
              text: `Error ${error.response.status}: ${JSON.stringify(
                error.response.data,
                null,
                2
              )}`,
            },
          ],
        };
      }
      return {
        content: [{ type: "text", text: `Error: ${error}` }],
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Umbraco API server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
