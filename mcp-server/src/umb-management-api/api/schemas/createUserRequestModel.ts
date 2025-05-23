/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * Umbraco Management API
 * This shows all APIs available in this version of Umbraco - including all the legacy apis that are available for backward compatibility
 * OpenAPI spec version: Latest
 */
import type { ReferenceByIdModel } from './referenceByIdModel.js';
import type { UserKindModel } from './userKindModel.js';

export interface CreateUserRequestModel {
  email: string;
  userName: string;
  name: string;
  userGroupIds: ReferenceByIdModel[];
  /** @nullable */
  id?: string | null;
  kind: UserKindModel;
}
