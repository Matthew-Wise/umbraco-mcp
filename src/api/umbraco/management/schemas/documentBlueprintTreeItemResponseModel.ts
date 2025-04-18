/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * Umbraco Management API
 * This shows all APIs available in this version of Umbraco - including all the legacy apis that are available for backward compatibility
 * OpenAPI spec version: Latest
 */
import type { DocumentBlueprintTreeItemResponseModelParent } from './documentBlueprintTreeItemResponseModelParent.js';
import type { DocumentBlueprintTreeItemResponseModelDocumentType } from './documentBlueprintTreeItemResponseModelDocumentType.js';

export interface DocumentBlueprintTreeItemResponseModel {
  hasChildren: boolean;
  id: string;
  /** @nullable */
  parent?: DocumentBlueprintTreeItemResponseModelParent;
  name: string;
  isFolder: boolean;
  /** @nullable */
  documentType?: DocumentBlueprintTreeItemResponseModelDocumentType;
}
