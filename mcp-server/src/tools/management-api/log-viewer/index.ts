import GetLogViewerTool from "./get/get-log-viewer-log.js";
import GetLogViewerLevelTool from "./get/get-log-viewer-level.js";
import GetLogViewerSearchTool from "./get/get-log-viewer-saved-search.js";
import GetLogViewerValidateLogsTool from "./get/get-log-viewer-validate-logs-size.js";
import GetLogViewerMessageTemplateTool from "./get/get-log-viewer-message-template.js";
import GetLogViewerSavedSearchByNameTool from "./get/get-log-viewer-saved-search-by-name.js";
import GetLogViewerLevelCountTool from "./get/get-log-viewer-level-count.js";
import PostLogViewerSavedSearchTool from "./post/post-log-viewer-saved-search.js";
import DeleteLogViewerSavedSearchByNameTool from "./delete/delete-log-viewer-saved-search-by-name.js";

export const LogViewerTools = [
  GetLogViewerTool,
  GetLogViewerLevelTool,
  GetLogViewerSearchTool,
  GetLogViewerValidateLogsTool,
  GetLogViewerMessageTemplateTool,
  GetLogViewerSavedSearchByNameTool,
  GetLogViewerLevelCountTool,
  PostLogViewerSavedSearchTool,
  DeleteLogViewerSavedSearchByNameTool,
];
