/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * Umbraco Workflow Management API
 * Describes the Umbraco Workflow Management API.
 * OpenAPI spec version: Latest
 */
import type { WorkflowSearchFilterModelCreatedDate } from './workflowSearchFilterModelCreatedDate.js';
import type { WorkflowSearchFilterModelCompletedDate } from './workflowSearchFilterModelCompletedDate.js';
import type { WorkflowSearchFilterModelReviewedOn } from './workflowSearchFilterModelReviewedOn.js';
import type { WorkflowSearchFilterModelDueOn } from './workflowSearchFilterModelDueOn.js';

export interface WorkflowSearchFilterModel {
  /** @nullable */
  unique?: string | null;
  /** @nullable */
  groupId?: string | null;
  /** @nullable */
  authorUserId?: string | null;
  /**
   * @nullable
   * @pattern ^([\w\d-_]){2,6}$
   */
  variant?: string | null;
  /** @nullable */
  type?: number | null;
  /** @nullable */
  expired?: boolean | null;
  /** @nullable */
  historyOnly?: boolean | null;
  /** @nullable */
  status?: number[] | null;
  /** @nullable */
  createdDate?: WorkflowSearchFilterModelCreatedDate;
  /** @nullable */
  completedDate?: WorkflowSearchFilterModelCompletedDate;
  /** @nullable */
  reviewedOn?: WorkflowSearchFilterModelReviewedOn;
  /** @nullable */
  dueOn?: WorkflowSearchFilterModelDueOn;
}
