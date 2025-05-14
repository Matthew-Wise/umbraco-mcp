import GetWebhookByIdTool from "./get/get-webhook-by-id.js";
import GetWebhookItemTool from "./get/get-webhook-by-id-array.js";
import DeleteWebhookTool from "./delete/delete-webhook.js";
import UpdateWebhookTool from "./put/update-webhook.js";
import GetWebhookEventsTool from "./get/get-webhook-events.js";
import GetAllWebhookLogsTool from "./get/get-all-webhook-logs.js";
import CreateWebhookTool from "./post/create-webhook.js";

export const WebhookTools = [
  CreateWebhookTool,
  GetWebhookByIdTool,
  GetWebhookItemTool,
  DeleteWebhookTool,
  UpdateWebhookTool,
  GetWebhookEventsTool,
  GetAllWebhookLogsTool,
]; 