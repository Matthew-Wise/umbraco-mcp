import { defineConfig } from "orval";
import { importFixer } from "./helpers.js";

export const UmbManagementApiOrvalConfig = defineConfig({
  "umbraco-management-api": {
    input: {
      target: "http://localhost:56472/umbraco/swagger/management/swagger.json",
      validation: false,
    },
    output: {
      mode: "split",
      clean: true,
      target: "./src/umb-management-api/api/api",
      schemas: "./src/umb-management-api/api/schemas",
      client: "axios",
      override: {
        mutator: {
          path: "./src/orval/client/mutators/umbraco-management.ts",
          name: "UmbracoManagementClient",
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
  "umbraco-management-api-zod": {
    input: {
      target: "http://localhost:56472/umbraco/swagger/management/swagger.json",
      validation: false,
    },
    output: {
      mode: "split",
      client: "zod",
      target: "./src/umb-management-api/api/",
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
