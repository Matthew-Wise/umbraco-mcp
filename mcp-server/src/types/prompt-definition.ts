import { PromptCallback } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ZodRawShape } from "zod";

export interface PromptDefinition<
  Args extends undefined | ZodRawShape = undefined
> {
  name: string;
  description: string;
  schema: Args;
  handler: PromptCallback<Args>;  
}
