import GetMemberGroupTool from "./get/get-member-group.js";
import GetMemberGroupByIdArrayTool from "./get/get-member-group-by-id-array.js";
import GetMemberGroupRootTool from "./get/get-root.js";
import CreateMemberGroupTool from "./post/create-member-group.js";
import UpdateMemberGroupTool from "./put/update-member-group.js";
import DeleteMemberGroupTool from "./delete/delete-member-group.js";

export const MemberGroupTools = [
  GetMemberGroupTool,
  GetMemberGroupByIdArrayTool,
  GetMemberGroupRootTool,
  CreateMemberGroupTool,
  UpdateMemberGroupTool,
  DeleteMemberGroupTool,
]; 