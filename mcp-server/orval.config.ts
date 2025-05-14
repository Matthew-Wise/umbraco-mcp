import { UmbManagementApiOrvalConfig } from "./src/orval/umb-management-api.js";
import { UmbWorkflowApiOrvalConfig } from "./src/orval/umb-workflow-api.js";

export default {
  ...UmbManagementApiOrvalConfig,
  ...UmbWorkflowApiOrvalConfig,
};
