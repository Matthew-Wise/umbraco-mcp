/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * Umbraco Workflow Management API
 * Describes the Umbraco Workflow Management API.
 * OpenAPI spec version: Latest
 */

export interface InstanceDetailModel {
  /** @nullable */
  completedOn?: string | null;
  requestedOn: string;
  /** @nullable */
  expireDate?: string | null;
  /** @nullable */
  releaseDate?: string | null;
  key: string;
  requestedByKey: string;
  totalSteps: number;
  /** @nullable */
  requestedBy?: string | null;
  /** @nullable */
  variantCode?: string | null;
  /** @nullable */
  variantName?: string | null;
  /** @nullable */
  attachment?: string | null;
  /** @nullable */
  comment?: string | null;
  /** @nullable */
  readonly status?: string | null;
  /** @nullable */
  readonly type?: string | null;
  /** @nullable */
  segments?: string | null;
  scheduled: boolean;
}
