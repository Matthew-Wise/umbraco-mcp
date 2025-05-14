import DeleteDictionaryItemTool from "./delete/delete-dictionary-item.js";
import FindDictionaryItemTool from "./get/find-dictionary-item.js";
import GetDictionaryItemTool from "./get/get-dictionary-item.js";
import CreateDictionaryItemTool from "./post/create-dictionary-item.js";
import UpdateDictionaryItemTool from "./put/update-dictionary-item.js";
import MoveDictionaryItemTool from "./put/move-dictionary-item.js";
import GetDictionaryRootTool from "./items/get/get-root.js";
import GetDictionaryChildrenTool from "./items/get/get-children.js";
import GetDictionaryAncestorsTool from "./items/get/get-ancestors.js";

export const DictionaryTools = [
  GetDictionaryItemTool,
  FindDictionaryItemTool,
  CreateDictionaryItemTool,
  DeleteDictionaryItemTool,
  UpdateDictionaryItemTool,
  MoveDictionaryItemTool,
  GetDictionaryRootTool,
  GetDictionaryChildrenTool,
  GetDictionaryAncestorsTool,
];
