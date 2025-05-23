/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * Umbraco Management API
 * This shows all APIs available in this version of Umbraco - including all the legacy apis that are available for backward compatibility
 * OpenAPI spec version: Latest
 */

export interface PackageDefinitionResponseModel {
  name: string;
  /** @nullable */
  contentNodeId?: string | null;
  contentLoadChildNodes: boolean;
  mediaIds: string[];
  mediaLoadChildNodes: boolean;
  documentTypes: string[];
  mediaTypes: string[];
  dataTypes: string[];
  templates: string[];
  partialViews: string[];
  stylesheets: string[];
  scripts: string[];
  languages: string[];
  dictionaryItems: string[];
  id: string;
  readonly packagePath: string;
}
