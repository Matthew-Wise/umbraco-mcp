import { PromptCallback } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PromptDefinition } from "../types/prompt-definition.js";
import { ZodRawShape } from "zod";

export const CreateUmbracoPrompt =
  <Args extends undefined | ZodRawShape = any>(
    name: string,
    description: string,
    schema: Args,
    handler: PromptCallback<Args>
  ): (() => PromptDefinition<Args>) =>
  () => ({
    name: name,
    description: description,
    schema: schema,
    handler: handler,
  });