import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DocumentPrompts } from "./document/index.js";

export function UmbracoPromptFactory(server: McpServer) {
  DocumentPrompts.map((prompt) => prompt()).forEach((prompt) =>
    server.prompt(prompt.name, prompt.description, prompt.schema, prompt.handler)
  );
}
