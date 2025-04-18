/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * Umbraco Management API
 * This shows all APIs available in this version of Umbraco - including all the legacy apis that are available for backward compatibility
 * OpenAPI spec version: Latest
 */
import type { UpdateDocumentTypeRequestModelCollection } from './updateDocumentTypeRequestModelCollection.js';
import type { UpdateDocumentTypePropertyTypeRequestModel } from './updateDocumentTypePropertyTypeRequestModel.js';
import type { UpdateDocumentTypePropertyTypeContainerRequestModel } from './updateDocumentTypePropertyTypeContainerRequestModel.js';
import type { ReferenceByIdModel } from './referenceByIdModel.js';
import type { UpdateDocumentTypeRequestModelDefaultTemplate } from './updateDocumentTypeRequestModelDefaultTemplate.js';
import type { DocumentTypeCleanupModel } from './documentTypeCleanupModel.js';
import type { DocumentTypeSortModel } from './documentTypeSortModel.js';
import type { DocumentTypeCompositionModel } from './documentTypeCompositionModel.js';

export interface UpdateDocumentTypeRequestModel {
  /** @minLength 1 */
  alias: string;
  /** @minLength 1 */
  name: string;
  /** @nullable */
  description?: string | null;
  /** @minLength 1 */
  icon: string;
  allowedAsRoot: boolean;
  variesByCulture: boolean;
  variesBySegment: boolean;
  /** @nullable */
  collection?: UpdateDocumentTypeRequestModelCollection;
  isElement: boolean;
  properties: UpdateDocumentTypePropertyTypeRequestModel[];
  containers: UpdateDocumentTypePropertyTypeContainerRequestModel[];
  allowedTemplates: ReferenceByIdModel[];
  /** @nullable */
  defaultTemplate?: UpdateDocumentTypeRequestModelDefaultTemplate;
  cleanup: DocumentTypeCleanupModel;
  allowedDocumentTypes: DocumentTypeSortModel[];
  compositions: DocumentTypeCompositionModel[];
}
