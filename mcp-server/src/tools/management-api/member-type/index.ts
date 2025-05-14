import CreateMemberTypeTool from "./post/create-member-type.js";
import GetMemberTypesByIdArrayTool from "./get/get-member-type-by-id-array.js";
import GetMemberTypeByIdTool from "./get/get-member-type-by-id.js";
import DeleteMemberTypeTool from "./delete/delete-member-type.js";
import UpdateMemberTypeTool from "./put/update-member-type.js";
import CopyMemberTypeTool from "./post/copy-member-type.js";
import GetMemberTypeAvailableCompositionsTool from "./post/get-member-type-available-compositions.js";
import GetMemberTypeCompositionReferencesTool from "./get/get-member-type-composition-references.js";
import GetMemberTypeConfigurationTool from "./get/get-member-type-configuration.js";
import GetMemberTypeRootTool from "./items/get/get-root.js";

export const MemberTypeTools = [
  CreateMemberTypeTool,
  GetMemberTypesByIdArrayTool,
  GetMemberTypeByIdTool,
  DeleteMemberTypeTool,
  UpdateMemberTypeTool,
  CopyMemberTypeTool,
  GetMemberTypeAvailableCompositionsTool,
  GetMemberTypeCompositionReferencesTool,
  GetMemberTypeConfigurationTool,
  GetMemberTypeRootTool,
]; 