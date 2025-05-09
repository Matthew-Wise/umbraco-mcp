import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { CultureTools } from "./culture/index.js";
import { DataTypeTools } from "./data-type/index.js";
import { DictionaryTools } from "./dictionary/index.js";
import { DocumentTypeTools } from "./document-type/index.js";
import { DocumentBlueprintTools } from "./document-blueprint/index.js";
import { DocumentTools } from "./document/index.js";
import { MemberGroupTools } from "./member-group/index.js";
import { LogViewerTools } from "./log-viewer/index.js";
import { LanguageTools } from "./language/index.js";
import { PropertyTypeTools } from "./property-type/index.js";
import { MediaTypeTools } from "./media-type/index.js";
import { MemberTypeTools } from "./member-type/index.js";

export function ToolFactory(server: McpServer) {
  CultureTools.map((tool) => tool()).forEach((tool) =>
    server.tool(tool.name, tool.description, tool.schema, tool.handler)
  );
  DataTypeTools.map((tool) => tool()).forEach((tool) =>
    server.tool(tool.name, tool.description, tool.schema, tool.handler)
  );
  DictionaryTools.map((tool) => tool()).forEach((tool) =>
    server.tool(tool.name, tool.description, tool.schema, tool.handler)
  );
  DocumentBlueprintTools.map((tool) => tool()).forEach((tool) =>
    server.tool(tool.name, tool.description, tool.schema, tool.handler)
  );
  DocumentTypeTools.map((tool) => tool()).forEach((tool) =>
    server.tool(tool.name, tool.description, tool.schema, tool.handler)
  );
  DocumentTools.map((tool) => tool()).forEach((tool) =>
    server.tool(tool.name, tool.description, tool.schema, tool.handler)
  );
  MediaTypeTools.map((tool) => tool()).forEach((tool) =>
    server.tool(tool.name, tool.description, tool.schema, tool.handler)
  );
  MemberGroupTools.map((tool) => tool()).forEach((tool) =>
    server.tool(tool.name, tool.description, tool.schema, tool.handler)
  );
  LogViewerTools.map((tool) => tool()).forEach((tool) =>
    server.tool(tool.name, tool.description, tool.schema, tool.handler)
  );
  LanguageTools.map((tool) => tool()).forEach((tool) =>
    server.tool(tool.name, tool.description, tool.schema, tool.handler)
  );
  PropertyTypeTools.map((tool) => tool()).forEach((tool) =>
    server.tool(tool.name, tool.description, tool.schema, tool.handler)
  );
  MemberTypeTools.map((tool) => tool()).forEach((tool) =>
    server.tool(tool.name, tool.description, tool.schema, tool.handler)
  );
}
