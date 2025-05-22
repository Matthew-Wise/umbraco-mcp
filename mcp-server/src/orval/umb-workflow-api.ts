import { defineConfig } from "orval";
import { importFixer } from "./helpers.js";

export const UmbWorkflowApiOrvalConfig = defineConfig({
  "umbraco-workflow-api": {
    input: {
      target:
        "http://localhost:56472/umbraco/swagger/workflow-management/swagger.json",
      validation: false,
    },
    output: {
      mode: "split",
      clean: true,
      target: "./src/umb-workflow/api/api",
      schemas: "./src/umb-workflow/api/schemas",
      client: "axios",
      override: {
        mutator: {
          path: "./src/orval/client/mutators/umbraco-workflow.ts",
          name: "UmbracoWorkflowClient",
          extension: ".js",
        },
      },
    },
    hooks: {
      afterAllFilesWrite: (files) => {
        importFixer(files);
      },
    },
  },
  "umbraco-workflow-api-zod": {
    input: {
      target:
        "http://localhost:56472/umbraco/swagger/workflow-management/swagger.json",
      validation: false,
    },
    output: {
      mode: "split",
      client: "zod",
      target: "./src/umb-workflow/api/api",
      fileExtension: ".zod.ts",
      override: {
        zod: {
          dateTimeOptions: {
            local: true,
          },
          coerce: {
            query: ["number", "boolean"],
          },
          generate: {
            param: true,
            query: true,
            header: true,
            body: true,
            response: true,
          },
        },
      },
    },
  },
});
