import GetUserGroupTool from "./get/get-user-group.js";
import GetUserGroupByIdArrayTool from "./get/get-user-group-by-id-array.js";
import GetUserGroupsTool from "./get/get-user-groups.js";
import GetFilterUserGroupTool from "./get/get-filter-user-group.js";
import CreateUserGroupTool from "./post/create-user-group.js";
import UpdateUserGroupTool from "./put/update-user-group.js";
import DeleteUserGroupTool from "./delete/delete-user-group.js";
import DeleteUserGroupsTool from "./delete/delete-user-groups.js";

export const UserGroupTools = [
  GetUserGroupTool,
  GetUserGroupByIdArrayTool,
  GetUserGroupsTool,
  GetFilterUserGroupTool,
  CreateUserGroupTool,
  UpdateUserGroupTool,
  DeleteUserGroupTool,
  DeleteUserGroupsTool,
]; 