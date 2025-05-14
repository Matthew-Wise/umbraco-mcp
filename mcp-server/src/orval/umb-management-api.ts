import { defineConfig } from "orval";
import { importFixer } from "./tools.js";

export const UmbManagementApiOrvalConfig = defineConfig({
  "umbraco-managment-api": {
    input: {
      target: "http://localhost:56472/umbraco/swagger/management/swagger.json",
      validation: false,
    },
    output: {
      mode: "split",
      clean: true,
      target: "./src/api/umbraco/management",
      schemas: "./src/api/umbraco/management/schemas",
      client: "axios",
      override: {
        mutator: {
          path: "./src/api/umbraco/clients/umbraco-management-client.ts",
          name: "UmbracoManagementClient",
        },
      },
    },
    hooks: {
      afterAllFilesWrite: (files) => {
        importFixer(files);
      },
    },
  },
  "umbraco-managment-api-zod": {
    input: {
      target: "http://localhost:56472/umbraco/swagger/management/swagger.json",
      validation: false,
    },
    output: {
      mode: "split",
      client: "zod",
      target: "./src/api/umbraco/management",
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
