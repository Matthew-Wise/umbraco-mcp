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
  const fixedContent = content.replace(
    /from\s+['"](\.\.\/\.\/schemas)['"]/g,
    "from '$1/index.js'"
  );

  fs.writeFileSync(file, fixedContent, "utf8");
};

const importFixer = (files) => {
  console.log(files);
  files.forEach((file) => {
    if (fs.lstatSync(file).isDirectory()) {
      fixSchemaDirectory(file);
    } else fixApiFile(file);
  });
};

module.exports = {
  // "umbraco-managment-api": {
  //   input: {
  //     target: "http://localhost:56472/umbraco/swagger/management/swagger.json",
  //     validation: false,
  //   },
  //   output: {
  //     mode: "split",
  //     clean: true,
  //     target: "./src/api/umbraco/management",
  //     schemas: "./src/api/umbraco/management/schemas",
  //     client: "zod",
  //     override: {
  //       zod: {
  //         dateTimeOptions: {
  //           local: true,
  //         },
  //       },
  //     },
  //   },
  //   hooks: {
  //     afterAllFilesWrite: (files) => {
  //       importFixer(files);
  //     },
  //   },
  // },
  "umbraco-delivery-api": {
    input: {
      target: "http://localhost:56472/umbraco/swagger/delivery/swagger.json",
      validation: false,
    },
    output: {
      mode: "tags-split",
      clean: true,
      target: "./src/api/umbraco/delivery",
      schemas: "./src/api/umbraco/delivery/schemas",
      client: "axios",
      fileExtension: ".client.ts",
    },

    hooks: {
      afterAllFilesWrite: (files) => {
        importFixer(files);
      },
    },
  },
  "umbraco-delivery-apiZod": {
    input: {
      target: "http://localhost:56472/umbraco/swagger/delivery/swagger.json",
      validation: false,
    },
    output: {
      mode: "tags-split",
      target: "./src/api/umbraco/delivery",
      client: "zod",
      fileExtension: ".zod.ts",
      override: {
        zod: {
          dateTimeOptions: {
            local: true,
          },
        },
      },
    },
  },
};
