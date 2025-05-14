import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ActionTools } from "./action/index.js";
import { UmbracoManagementClient } from "@/clients/umbraco-management-client.js";

export async function UmbracoWorkflowToolFactory(server: McpServer) {
  const client = UmbracoManagementClient.getClient();
  const manifest = await client.getManifestManifest();

  if (!manifest.some((m) => m.name === "Umbraco Workflow")) {
    return;
  }

  ActionTools.map((tool) => tool()).forEach((tool) =>
    server.tool(tool.name, tool.description, tool.schema, tool.handler)
  );
}
