import GetDocumentBlueprintTool from "./get/get-blueprint.js";
import DeleteDocumentBlueprintTool from "./delete/delete-blueprint.js";
import UpdateDocumentBlueprintTool from "./put/update-blueprint.js";
import CreateDocumentBlueprintTool from "./post/create-blueprint.js";
import GetDocumentBlueprintAncestorsTool from "./get/get-ancestors.js";
import GetDocumentBlueprintChildrenTool from "./get/get-children.js";
import GetDocumentBlueprintRootTool from "./get/get-root.js";

export const DocumentBlueprintTools = [
  GetDocumentBlueprintTool,
  DeleteDocumentBlueprintTool,
  UpdateDocumentBlueprintTool,
  CreateDocumentBlueprintTool,
  GetDocumentBlueprintAncestorsTool,
  GetDocumentBlueprintChildrenTool,
  GetDocumentBlueprintRootTool
]; 