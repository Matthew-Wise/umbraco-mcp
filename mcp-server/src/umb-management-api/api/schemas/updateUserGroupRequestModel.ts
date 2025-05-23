/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * Umbraco Management API
 * This shows all APIs available in this version of Umbraco - including all the legacy apis that are available for backward compatibility
 * OpenAPI spec version: Latest
 */
import type { UpdateUserGroupRequestModelDocumentStartNode } from './updateUserGroupRequestModelDocumentStartNode.js';
import type { UpdateUserGroupRequestModelMediaStartNode } from './updateUserGroupRequestModelMediaStartNode.js';
import type { UpdateUserGroupRequestModelPermissionsItem } from './updateUserGroupRequestModelPermissionsItem.js';

export interface UpdateUserGroupRequestModel {
  name: string;
  alias: string;
  /** @nullable */
  icon?: string | null;
  sections: string[];
  languages: string[];
  hasAccessToAllLanguages: boolean;
  /** @nullable */
  documentStartNode?: UpdateUserGroupRequestModelDocumentStartNode;
  documentRootAccess: boolean;
  /** @nullable */
  mediaStartNode?: UpdateUserGroupRequestModelMediaStartNode;
  mediaRootAccess: boolean;
  fallbackPermissions: string[];
  permissions: UpdateUserGroupRequestModelPermissionsItem[];
}
