import GetAllRedirectsTool from "./get/get-all-redirects.js";
import GetRedirectByIdTool from "./get/get-redirect-by-id.js";
import DeleteRedirectTool from "./delete/delete-redirect.js";
import GetRedirectStatusTool from "./get/get-redirect-status.js";
import UpdateRedirectStatusTool from "./post/update-redirect-status.js";

export const RedirectTools = [
  GetAllRedirectsTool,
  GetRedirectByIdTool,
  DeleteRedirectTool,
  GetRedirectStatusTool,
  UpdateRedirectStatusTool,
]; 