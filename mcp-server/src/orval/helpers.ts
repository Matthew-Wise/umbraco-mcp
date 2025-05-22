import fs from "fs";
import path from "path";

const fixSchemaDirectory = (dir: any) => {
  const schemaFiles = fs.readdirSync(dir).filter((f: any) => f.endsWith(".ts"));
  schemaFiles.forEach((schemaFile: any) => {
    const schemaFilePath = path.join(dir, schemaFile);
    const content = fs
      .readFileSync(schemaFilePath, "utf8")
      .replace(/from\s+['"](\.\/.*?)(?<!\.ts)['"]/g, (match: any, p1: any) => {
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

const fixApiFile = (file: any) => {
  const content = fs.readFileSync(file, "utf8");

  // Fix TypeScript errors by ensuring proper type annotations and imports
  const fixedContent = content.replace(
    /from\s+['"](\.\.\/schemas)['"]/g,
    "from '$1/index.js'"
  );

  fs.writeFileSync(file, fixedContent, "utf8");
};

export const importFixer = (files: string[]) => {
  files.forEach((file) => {
    if (fs.lstatSync(file).isDirectory()) {
      fixSchemaDirectory(file);
    } else fixApiFile(file);
  });
};
