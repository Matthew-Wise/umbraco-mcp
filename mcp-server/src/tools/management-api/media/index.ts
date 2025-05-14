import CreateMediaTool from "./post/create-media.js";
import DeleteMediaTool from "./delete/delete-media.js";
import GetMediaByIdTool from "./get/get-media-by-id.js";
import UpdateMediaTool from "./put/update-media.js";
import GetMediaConfigurationTool from "./get/get-media-configuration.js";
import GetMediaUrlsTool from "./get/get-media-urls.js";
import ValidateMediaTool from "./post/validate-media.js";
import SortMediaTool from "./put/sort-media.js";
import GetMediaByIdArrayTool from "./get/get-media-by-id-array.js";
import MoveMediaTool from "./put/move-media.js";
import GetMediaAncestorsTool from "./items/get/get-ancestors.js";
import GetMediaChildrenTool from "./items/get/get-children.js";
import GetMediaRootTool from "./items/get/get-root.js";
import GetMediaAuditLogTool from "./get/get-media-audit-log.js";
import GetMediaRecycleBinRootTool from "./items/get/get-recycle-bin-root.js";
import GetMediaRecycleBinChildrenTool from "./items/get/get-recycle-bin-children.js";
import EmptyRecycleBinTool from "./delete/empty-recycle-bin.js";
import RestoreFromRecycleBinTool from "./put/restore-from-recycle-bin.js";
import MoveMediaToRecycleBinTool from "./put/move-to-recycle-bin.js";
import DeleteFromRecycleBinTool from "./delete/delete-from-recycle-bin.js";

export const MediaTools = [
  CreateMediaTool,
  GetMediaByIdTool,
  DeleteMediaTool,
  UpdateMediaTool,
  GetMediaConfigurationTool,
  GetMediaUrlsTool,
  ValidateMediaTool,
  SortMediaTool,
  GetMediaByIdArrayTool,
  MoveMediaTool,
  GetMediaAncestorsTool,
  GetMediaChildrenTool,
  GetMediaRootTool,
  GetMediaAuditLogTool,
  GetMediaRecycleBinRootTool,
  GetMediaRecycleBinChildrenTool,
  EmptyRecycleBinTool,
  RestoreFromRecycleBinTool,
  MoveMediaToRecycleBinTool,
  DeleteFromRecycleBinTool,
]; 