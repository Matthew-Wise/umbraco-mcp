/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * Umbraco Management API
 * This shows all APIs available in this version of Umbraco - including all the legacy apis that are available for backward compatibility
 * OpenAPI spec version: Latest
 */
import type { RuntimeModeModel } from './runtimeModeModel.js';

export interface ServerInformationResponseModel {
  version: string;
  assemblyVersion: string;
  baseUtcOffset: string;
  runtimeMode: RuntimeModeModel;
}
