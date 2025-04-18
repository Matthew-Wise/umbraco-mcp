/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * Umbraco Management API
 * This shows all APIs available in this version of Umbraco - including all the legacy apis that are available for backward compatibility
 * OpenAPI spec version: Latest
 */
import type { ReferenceByIdModel } from './referenceByIdModel.js';
import type { RelationReferenceModel } from './relationReferenceModel.js';

export interface RelationResponseModel {
  id: string;
  relationType: ReferenceByIdModel;
  readonly parent: RelationReferenceModel;
  readonly child: RelationReferenceModel;
  readonly createDate: string;
  /** @nullable */
  readonly comment?: string | null;
}
