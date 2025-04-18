/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * Umbraco Management API
 * This shows all APIs available in this version of Umbraco - including all the legacy apis that are available for backward compatibility
 * OpenAPI spec version: Latest
 */
import type { CreateMediaTypePropertyTypeContainerRequestModelParent } from './createMediaTypePropertyTypeContainerRequestModelParent.js';

export interface CreateMediaTypePropertyTypeContainerRequestModel {
  id: string;
  /** @nullable */
  parent?: CreateMediaTypePropertyTypeContainerRequestModelParent;
  /** @nullable */
  name?: string | null;
  /** @minLength 1 */
  type: string;
  sortOrder: number;
}
