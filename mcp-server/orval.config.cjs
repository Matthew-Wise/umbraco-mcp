const fs = require("fs");
const path = require("path");

const fixSchemaDirectory = (dir) => {
  const schemaFiles = fs.readdirSync(dir).filter((f) => f.endsWith(".ts"));
  schemaFiles.forEach((schemaFile) => {
    const schemaFilePath = path.join(dir, schemaFile);
    const content = fs
      .readFileSync(schemaFilePath, "utf8")
      .replace(/from\s+['"](\.\/.*?)(?<!\.ts)['"]/g, (match, p1) => {
        const resolvedPath = path.resolve(
          path.dirname(schemaFilePath),
          p1 + ".ts"
        );
        if (fs.existsSync(resolvedPath)) {
          return `from '${p1}.js'`;
        }
        return match;
      });

    fs.writeFileSync(schemaFilePath, content, "utf8");
  });
};

const fixApiFile = (file) => {
  const content = fs.readFileSync(file, "utf8");

  // Fix TypeScript errors by ensuring proper type annotations and imports
  const fixedContent = content
    .replace(/from\s+['"](\.\.\/\.\/schemas)['"]/g, "from '$1/index.js'")
    .replace(
      "../clients/umbraco-management-client",
      "../clients/umbraco-management-client.js"
    );

  fs.writeFileSync(file, fixedContent, "utf8");
};

const importFixer = (files) => {
  files.forEach((file) => {
    if (fs.lstatSync(file).isDirectory()) {
      fixSchemaDirectory(file);
    } else fixApiFile(file);
  });
};

module.exports = {
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
            query: ['number', 'boolean']
          }
        },
      },
    },
  },
};
