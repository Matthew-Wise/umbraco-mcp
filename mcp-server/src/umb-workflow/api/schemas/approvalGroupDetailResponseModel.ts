/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * Umbraco Workflow Management API
 * Describes the Umbraco Workflow Management API.
 * OpenAPI spec version: Latest
 */
import type { SettingsPropertyDisplayModel } from './settingsPropertyDisplayModel.js';
import type { ApprovalGroupDetailPermissionResponseModel } from './approvalGroupDetailPermissionResponseModel.js';
import type { User2ApprovalGroupModel } from './user2ApprovalGroupModel.js';

export interface ApprovalGroupDetailResponseModel {
  readonly entityType: string;
  alias: string;
  unique: string;
  name: string;
  /** @nullable */
  icon?: string | null;
  inheritMembers: string;
  properties: SettingsPropertyDisplayModel[];
  permissions: ApprovalGroupDetailPermissionResponseModel[];
  users: User2ApprovalGroupModel[];
}
