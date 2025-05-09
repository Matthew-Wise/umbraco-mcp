/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * Umbraco Management API
 * This shows all APIs available in this version of Umbraco - including all the legacy apis that are available for backward compatibility
 * OpenAPI spec version: Latest
 */
import type { WebhookResponseModelHeaders } from './webhookResponseModelHeaders.js';
import type { WebhookEventResponseModel } from './webhookEventResponseModel.js';

export interface WebhookResponseModel {
  enabled: boolean;
  /** @nullable */
  name?: string | null;
  /** @nullable */
  description?: string | null;
  /** @minLength 1 */
  url: string;
  contentTypeKeys: string[];
  headers: WebhookResponseModelHeaders;
  id: string;
  events: WebhookEventResponseModel[];
}
