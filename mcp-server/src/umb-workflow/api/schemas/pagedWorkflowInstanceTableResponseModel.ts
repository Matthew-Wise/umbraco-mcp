/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * Umbraco Workflow Management API
 * Describes the Umbraco Workflow Management API.
 * OpenAPI spec version: Latest
 */
import type { WorkflowInstanceTableResponseModel } from './workflowInstanceTableResponseModel.js';

export interface PagedWorkflowInstanceTableResponseModel {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  items: WorkflowInstanceTableResponseModel[];
}
