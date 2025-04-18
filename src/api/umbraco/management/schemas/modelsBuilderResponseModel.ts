/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * Umbraco Management API
 * This shows all APIs available in this version of Umbraco - including all the legacy apis that are available for backward compatibility
 * OpenAPI spec version: Latest
 */
import type { ModelsModeModel } from './modelsModeModel.js';

export interface ModelsBuilderResponseModel {
  mode: ModelsModeModel;
  canGenerate: boolean;
  outOfDateModels: boolean;
  /** @nullable */
  lastError?: string | null;
  /** @nullable */
  version?: string | null;
  /** @nullable */
  modelsNamespace?: string | null;
  trackingOutOfDateModels: boolean;
}
