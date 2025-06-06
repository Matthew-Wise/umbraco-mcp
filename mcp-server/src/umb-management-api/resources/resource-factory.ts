import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DataTypeTemplateResources } from "./data-types/index.js";
import { LanugageReadResources } from "./language/index.js";

export function UmbracoResourceFactory(server: McpServer) {
  LanugageReadResources.map((resource) => resource()).forEach((resource) =>
    server.resource(resource.name, resource.uri, { description: resource.description }, resource.handler)
  );

  DataTypeTemplateResources.map((resource) => resource()).forEach((resource) =>
    server.resource(resource.name, resource.template, { description: resource.description }, resource.handler)
  );
}
