/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * Umbraco Management API
 * This shows all APIs available in this version of Umbraco - including all the legacy apis that are available for backward compatibility
 * OpenAPI spec version: Latest
 */
import type { DynamicRootQueryOriginRequestModel } from './dynamicRootQueryOriginRequestModel.js';
import type { DynamicRootQueryStepRequestModel } from './dynamicRootQueryStepRequestModel.js';

export interface DynamicRootQueryRequestModel {
  origin: DynamicRootQueryOriginRequestModel;
  steps: DynamicRootQueryStepRequestModel[];
}
