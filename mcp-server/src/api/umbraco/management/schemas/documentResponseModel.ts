/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * Umbraco Management API
 * This shows all APIs available in this version of Umbraco - including all the legacy apis that are available for backward compatibility
 * OpenAPI spec version: Latest
 */
import type { DocumentValueResponseModel } from './documentValueResponseModel.js';
import type { DocumentVariantResponseModel } from './documentVariantResponseModel.js';
import type { DocumentTypeReferenceResponseModel } from './documentTypeReferenceResponseModel.js';
import type { DocumentUrlInfoModel } from './documentUrlInfoModel.js';
import type { DocumentResponseModelTemplate } from './documentResponseModelTemplate.js';

export interface DocumentResponseModel {
  values: DocumentValueResponseModel[];
  variants: DocumentVariantResponseModel[];
  id: string;
  documentType: DocumentTypeReferenceResponseModel;
  urls: DocumentUrlInfoModel[];
  /** @nullable */
  template?: DocumentResponseModelTemplate;
  isTrashed: boolean;
}
