/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * Umbraco Workflow Management API
 * Describes the Umbraco Workflow Management API.
 * OpenAPI spec version: Latest
 */
import type { HistoryCleanupModelStatusesToDelete } from './historyCleanupModelStatusesToDelete.js';
import type { HistoryCleanupModelCleanupRules } from './historyCleanupModelCleanupRules.js';

export interface HistoryCleanupModel {
  enableCleanup: boolean;
  keepHistoryForDays: number;
  statusesToDelete: HistoryCleanupModelStatusesToDelete;
  cleanupRules: HistoryCleanupModelCleanupRules;
}
