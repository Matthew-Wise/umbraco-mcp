#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { UmbracoMcpServer } from "./server/umbraco-mcp-server.js";
import { UmbracoToolFactory } from "./tools/management-api/tool-factory.js";
import { ResourceFactory } from "./resources/resource-factory.js";
import { UmbracoWorkflowToolFactory } from "tools/workflow-api/tool-factory.js";

const main = async () => {
  // Create an MCP server
  const server = UmbracoMcpServer.GetServer();

  ResourceFactory(server);
  UmbracoToolFactory(server);
  await UmbracoWorkflowToolFactory(server);

  // Start receiving messages on stdin and sending messages on stdout
  const transport = new StdioServerTransport();
  await server.connect(transport);
};

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
