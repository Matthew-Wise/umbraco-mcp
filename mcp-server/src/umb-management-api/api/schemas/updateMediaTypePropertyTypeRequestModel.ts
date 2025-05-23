/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * Umbraco Management API
 * This shows all APIs available in this version of Umbraco - including all the legacy apis that are available for backward compatibility
 * OpenAPI spec version: Latest
 */
import type { UpdateMediaTypePropertyTypeRequestModelContainer } from './updateMediaTypePropertyTypeRequestModelContainer.js';
import type { ReferenceByIdModel } from './referenceByIdModel.js';
import type { PropertyTypeValidationModel } from './propertyTypeValidationModel.js';
import type { PropertyTypeAppearanceModel } from './propertyTypeAppearanceModel.js';

export interface UpdateMediaTypePropertyTypeRequestModel {
  id: string;
  /** @nullable */
  container?: UpdateMediaTypePropertyTypeRequestModelContainer;
  sortOrder: number;
  /** @minLength 1 */
  alias: string;
  /** @minLength 1 */
  name: string;
  /** @nullable */
  description?: string | null;
  dataType: ReferenceByIdModel;
  variesByCulture: boolean;
  variesBySegment: boolean;
  validation: PropertyTypeValidationModel;
  appearance: PropertyTypeAppearanceModel;
}
