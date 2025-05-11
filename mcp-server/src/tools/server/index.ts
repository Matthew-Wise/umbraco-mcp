import GetServerInformationTool from "./get/get-server-information.js";
import GetServerStatusTool from "./get/get-server-status.js";
import GetServerConfigurationTool from "./get/get-server-configuration.js";
import GetServerTroubleshootingTool from "./get/get-server-troubleshooting.js";
import GetServerUpgradeCheckTool from "./get/get-server-upgrade-check.js";

export const ServerTools = [
  GetServerInformationTool,
  GetServerStatusTool,
  GetServerConfigurationTool,
  GetServerTroubleshootingTool,
  GetServerUpgradeCheckTool,
]; 