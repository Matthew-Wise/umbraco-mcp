import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { CultureTools } from "./culture/index.js";
import { DataTypeTools } from "./data-type/index.js";
import { DictionaryTools } from "./dictionary/index.js";
import { DocumentTypeTools } from "./document-type/index.js";
import { DocumentBlueprintTools } from "./document-blueprint/index.js";
import { DocumentTools } from "./document/index.js";
import { MemberGroupTools } from "./member-group/index.js";
import { MediaTypeTools } from "./media-type/index.js";
import { MemberTypeTools } from "./member-type/index.js";
import { MemberTools } from "./member/index.js";
import { LogViewerTools } from "./log-viewer/index.js";
import { LanguageTools } from "./language/index.js";
import { PropertyTypeTools } from "./property-type/index.js";
import { WebhookTools } from "./webhook/index.js";
import { ServerTools } from "./server/index.js";
import { RedirectTools } from "./redirect/index.js";
import { UserGroupTools } from "./user-group/index.js";
import { TemporaryFileTools } from "./temporary-file/index.js";
import { MediaTools } from "./media/index.js";

export function UmbracoToolFactory(server: McpServer) {
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
  MemberTools.map((tool) => tool()).forEach((tool) =>
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
  WebhookTools.map((tool) => tool()).forEach((tool) =>
    server.tool(tool.name, tool.description, tool.schema, tool.handler)
  );
  ServerTools.map((tool) => tool()).forEach((tool) =>
    server.tool(tool.name, tool.description, tool.schema, tool.handler)
  );
  RedirectTools.map((tool) => tool()).forEach((tool) =>
    server.tool(tool.name, tool.description, tool.schema, tool.handler)
  );
  UserGroupTools.map((tool) => tool()).forEach((tool) =>
    server.tool(tool.name, tool.description, tool.schema, tool.handler)
  );
  TemporaryFileTools.map((tool) => tool()).forEach((tool) =>
    server.tool(tool.name, tool.description, tool.schema, tool.handler)
  );
  MediaTools.map((tool) => tool()).forEach((tool) =>
    server.tool(tool.name, tool.description, tool.schema, tool.handler)
  );
}
