/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * Umbraco Workflow Management API
 * Describes the Umbraco Workflow Management API.
 * OpenAPI spec version: Latest
 */
import type { ContentReviewCollectionResponseModel } from './contentReviewCollectionResponseModel.js';

export interface PagedContentReviewCollectionResponseModel {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  items: ContentReviewCollectionResponseModel[];
}
