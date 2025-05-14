import GetLanguageItemsTool from "./get/get-language-items.js";
import GetDefaultLanguageTool from "./get/get-default-language.js";
import GetLanguageByIsoCodeTool from "./get/get-language-by-iso-code.js";
import CreateLanguageTool from "./post/create-language.js";
import UpdateLanguageTool from "./put/update-language.js";
import DeleteLanguageTool from "./delete/delete-language.js";

export const LanguageTools = [
  GetLanguageItemsTool,
  GetDefaultLanguageTool,
  GetLanguageByIsoCodeTool,
  CreateLanguageTool,
  UpdateLanguageTool,
  DeleteLanguageTool,
];
