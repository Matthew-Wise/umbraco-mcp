import { ZodRawShape } from "zod";
import { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ToolDefinition } from "../types/tool-definition.js";

export const CreateUmbracoTool =
  <Args extends undefined | ZodRawShape = any>(
    name: string,
    description: string,
    schema: Args,
    handler: ToolCallback<Args>
  ): (() => ToolDefinition<Args>) =>
  () => ({
    name: name,
    description: description,
    schema: schema,
    handler: (async (args: any, context: any) => {
      try {
        return await handler(args, context);
      } catch (error) {
        // Log the error
        console.error(`Error in tool ${name}:`, error);
        const errorDetails =
          error instanceof Error
            ? {
                message: error.message,
                cause: error.cause,
                response: (error as any).response?.data,
              }
            : error;

        return {
          content: [
            {
              type: "text" as const,
              text: `Error using ${name}:\n${JSON.stringify(
                errorDetails,
                null,
                2
              )}`,
            },
          ],
        };
      }
    }) as ToolCallback<Args>,
  });
