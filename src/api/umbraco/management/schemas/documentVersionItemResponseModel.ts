/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * Umbraco Management API
 * This shows all APIs available in this version of Umbraco - including all the legacy apis that are available for backward compatibility
 * OpenAPI spec version: Latest
 */
import type { ReferenceByIdModel } from './referenceByIdModel.js';

export interface DocumentVersionItemResponseModel {
  id: string;
  document: ReferenceByIdModel;
  documentType: ReferenceByIdModel;
  user: ReferenceByIdModel;
  versionDate: string;
  isCurrentPublishedVersion: boolean;
  isCurrentDraftVersion: boolean;
  preventCleanup: boolean;
}
