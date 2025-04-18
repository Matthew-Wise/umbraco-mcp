/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * Umbraco Management API
 * This shows all APIs available in this version of Umbraco - including all the legacy apis that are available for backward compatibility
 * OpenAPI spec version: Latest
 */
import type { HealthStatusResponseModel } from './healthStatusResponseModel.js';
import type { IndexResponseModelProviderProperties } from './indexResponseModelProviderProperties.js';

export interface IndexResponseModel {
  /** @minLength 1 */
  name: string;
  healthStatus: HealthStatusResponseModel;
  canRebuild: boolean;
  searcherName: string;
  documentCount: number;
  fieldCount: number;
  /** @nullable */
  providerProperties?: IndexResponseModelProviderProperties;
}
