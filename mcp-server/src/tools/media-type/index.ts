import GetMediaTypeConfigurationTool from "./get/get-media-type-configuration.js";
import GetMediaTypeByIdTool from "./get/get-media-type-by-id.js";
import GetMediaTypeByIdsTool from "./get/get-media-type-by-ids.js";
import GetAllowedMediaTypeTool from "./get/get-allowed.js";
import GetMediaTypeAllowedAtRootTool from "./get/get-media-type-allowed-at-root.js";
import GetMediaTypeAllowedChildrenTool from "./get/get-media-type-allowed-children.js";
import GetMediaTypeCompositionReferencesTool from "./get/get-media-type-composition-references.js";
import GetMediaTypeRootTool from "./items/get/get-root.js";
import GetMediaTypeChildrenTool from "./items/get/get-children.js";
import GetMediaTypeAncestorsTool from "./items/get/get-ancestors.js";
import GetMediaTypeFolderTool from "./folders/get/get-folder.js";
import CreateMediaTypeFolderTool from "./folders/post/create-folder.js";
import DeleteMediaTypeFolderTool from "./folders/delete/delete-folder.js";
import UpdateMediaTypeFolderTool from "./folders/put/update-folder.js";
import CreateMediaTypeTool from "./post/create-media-type.js";
import CopyMediaTypeTool from "./post/copy-media-type.js";
import GetMediaTypeAvailableCompositionsTool from "./post/get-media-type-available-compositions.js";
import UpdateMediaTypeTool from "./put/update-media-type.js";
import MoveMediaTypeTool from "./put/move-media-type.js";
import DeleteMediaTypeTool from "./delete/delete-media-type.js";

export const MediaTypeTools = [
  GetMediaTypeConfigurationTool,
  GetMediaTypeByIdTool,
  GetMediaTypeByIdsTool,
  GetAllowedMediaTypeTool,
  GetMediaTypeAllowedAtRootTool,
  GetMediaTypeAllowedChildrenTool,
  GetMediaTypeCompositionReferencesTool,
  GetMediaTypeRootTool,
  GetMediaTypeChildrenTool,
  GetMediaTypeAncestorsTool,
  GetMediaTypeFolderTool,
  CreateMediaTypeFolderTool,
  DeleteMediaTypeFolderTool,
  UpdateMediaTypeFolderTool,
  CreateMediaTypeTool,
  CopyMediaTypeTool,
  GetMediaTypeAvailableCompositionsTool,
  UpdateMediaTypeTool,
  MoveMediaTypeTool,
  DeleteMediaTypeTool,
]; 