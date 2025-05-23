/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * Umbraco Workflow Management API
 * Describes the Umbraco Workflow Management API.
 * OpenAPI spec version: Latest
 */
import type {
  ActionWorkflowRequestModel,
  ActionWorkflowResponseModel,
  AdvancedSearchQueryModel,
  AdvancedSearchResponseModel,
  AdvancedSearchScaffoldResponseModel,
  ApprovalGroupDetailResponseModel,
  ApprovalGroupItemResponseModel,
  ChartResponseModel,
  ContentReviewRequestModel,
  ContentReviewsConfigModel,
  ContentReviewsSaveSettingsModel,
  ContentSlimModel,
  ContentTypePropertyModel,
  DocumentConfigResponseModel,
  DocumentConfigUpdateRequestModel,
  GetApprovalGroupInheritedMembersParams,
  GetApprovalGroupParams,
  GetChartContentReviewChartParams,
  GetChartWorkflowChartParams,
  GetContentContentSlimParams,
  GetContentDiffParams,
  GetHistoryCleanupParams,
  GetInstanceParams,
  GetInstanceStatus200,
  GetInstanceStatusParams,
  GetItemApprovalGroupParams,
  GetScaffoldParams,
  HistoryCleanupModel,
  InitiateWorkflowRequestModel,
  PackageVersionModel,
  PagedApprovalGroupCollectionReponseModel,
  PagedContentReviewCollectionResponseModel,
  PagedWorkflowInstanceTableResponseModel,
  PutHistoryCleanupBody,
  UnlockDocumentRequestModel,
  User2ApprovalGroupModel,
  WorkflowDiffsModel,
  WorkflowInformationResponseModel,
  WorkflowInstanceResponseModel,
  WorkflowScaffoldResponseModel,
  WorkflowSearchRequestModel,
  WorkflowSettingsPropertiesModel,
  WorkflowTasksForInstanceResponseModel
} from '../schemas/index.js';

import { UmbracoWorkflowClient } from '../../../orval/client/mutators/umbraco-workflow.js';

// https://stackoverflow.com/questions/49579094/typescript-conditional-types-filter-out-readonly-properties-pick-only-requir/49579497#49579497
type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <
T,
>() => T extends Y ? 1 : 2
? A
: B;

type WritableKeys<T> = {
[P in keyof T]-?: IfEquals<
  { [Q in P]: T[P] },
  { -readonly [Q in P]: T[P] },
  P
>;
}[keyof T];

type UnionToIntersection<U> =
  (U extends any ? (k: U)=>void : never) extends ((k: infer I)=>void) ? I : never;
type DistributeReadOnlyOverUnions<T> = T extends any ? NonReadonly<T> : never;

type Writable<T> = Pick<T, WritableKeys<T>>;
type NonReadonly<T> = [T] extends [UnionToIntersection<T>] ? {
  [P in keyof Writable<T>]: T[P] extends object
    ? NonReadonly<NonNullable<T[P]>>
    : T[P];
} : DistributeReadOnlyOverUnions<T>;


type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];


  export const getUmbracoWorkflowManagementAPI = () => {
const postActionApprove = (
    actionWorkflowRequestModel: ActionWorkflowRequestModel,
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<ActionWorkflowResponseModel>(
      {url: `/umbraco/workflow/management/api/v1/action/approve`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: actionWorkflowRequestModel
    },
      options);
    }
  
const postActionCancel = (
    actionWorkflowRequestModel: ActionWorkflowRequestModel,
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<ActionWorkflowResponseModel>(
      {url: `/umbraco/workflow/management/api/v1/action/cancel`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: actionWorkflowRequestModel
    },
      options);
    }
  
const postActionInitiate = (
    initiateWorkflowRequestModel: InitiateWorkflowRequestModel,
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<ActionWorkflowResponseModel>(
      {url: `/umbraco/workflow/management/api/v1/action/initiate`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: initiateWorkflowRequestModel
    },
      options);
    }
  
const postActionReject = (
    actionWorkflowRequestModel: ActionWorkflowRequestModel,
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<ActionWorkflowResponseModel>(
      {url: `/umbraco/workflow/management/api/v1/action/reject`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: actionWorkflowRequestModel
    },
      options);
    }
  
const postActionResubmit = (
    actionWorkflowRequestModel: ActionWorkflowRequestModel,
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<ActionWorkflowResponseModel>(
      {url: `/umbraco/workflow/management/api/v1/action/resubmit`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: actionWorkflowRequestModel
    },
      options);
    }
  
const getAdvancedSearchContentTypes = (
    
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<AdvancedSearchScaffoldResponseModel>(
      {url: `/umbraco/workflow/management/api/v1/advanced-search/content-types`, method: 'GET'
    },
      options);
    }
  
const postAdvancedSearchSearch = (
    advancedSearchQueryModel: AdvancedSearchQueryModel,
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<AdvancedSearchResponseModel>(
      {url: `/umbraco/workflow/management/api/v1/advanced-search/search`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: advancedSearchQueryModel
    },
      options);
    }
  
const postApprovalGroup = (
    approvalGroupDetailResponseModel: NonReadonly<ApprovalGroupDetailResponseModel>,
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<void>(
      {url: `/umbraco/workflow/management/api/v1/approval-group`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: approvalGroupDetailResponseModel
    },
      options);
    }
  
const getApprovalGroup = (
    params?: GetApprovalGroupParams,
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<PagedApprovalGroupCollectionReponseModel>(
      {url: `/umbraco/workflow/management/api/v1/approval-group`, method: 'GET',
        params
    },
      options);
    }
  
const getApprovalGroupById = (
    id: string,
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<ApprovalGroupDetailResponseModel>(
      {url: `/umbraco/workflow/management/api/v1/approval-group/${id}`, method: 'GET'
    },
      options);
    }
  
const deleteApprovalGroupById = (
    id: string,
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<void>(
      {url: `/umbraco/workflow/management/api/v1/approval-group/${id}`, method: 'DELETE'
    },
      options);
    }
  
const putApprovalGroupById = (
    id: string,
    approvalGroupDetailResponseModel: NonReadonly<ApprovalGroupDetailResponseModel>,
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<void>(
      {url: `/umbraco/workflow/management/api/v1/approval-group/${id}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: approvalGroupDetailResponseModel
    },
      options);
    }
  
const getApprovalGroupInheritedMembers = (
    params?: GetApprovalGroupInheritedMembersParams,
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<User2ApprovalGroupModel[]>(
      {url: `/umbraco/workflow/management/api/v1/approval-group/inherited-members`, method: 'GET',
        params
    },
      options);
    }
  
const getApprovalGroupScaffold = (
    
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<ApprovalGroupDetailResponseModel>(
      {url: `/umbraco/workflow/management/api/v1/approval-group/scaffold`, method: 'GET'
    },
      options);
    }
  
const getItemApprovalGroup = (
    params?: GetItemApprovalGroupParams,
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<ApprovalGroupItemResponseModel[]>(
      {url: `/umbraco/workflow/management/api/v1/item/approval-group`, method: 'GET',
        params
    },
      options);
    }
  
const getChartContentReviewChart = (
    params?: GetChartContentReviewChartParams,
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<ChartResponseModel>(
      {url: `/umbraco/workflow/management/api/v1/chart/content-review-chart`, method: 'GET',
        params
    },
      options);
    }
  
const getChartWorkflowChart = (
    params?: GetChartWorkflowChartParams,
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<ChartResponseModel>(
      {url: `/umbraco/workflow/management/api/v1/chart/workflow-chart`, method: 'GET',
        params
    },
      options);
    }
  
const putConfig = (
    documentConfigUpdateRequestModel: DocumentConfigUpdateRequestModel,
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<DocumentConfigResponseModel>(
      {url: `/umbraco/workflow/management/api/v1/config`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: documentConfigUpdateRequestModel
    },
      options);
    }
  
const postConfigUnlock = (
    unlockDocumentRequestModel: UnlockDocumentRequestModel,
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<boolean>(
      {url: `/umbraco/workflow/management/api/v1/config/unlock`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: unlockDocumentRequestModel
    },
      options);
    }
  
const getContentReviewConfig = (
    
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<ContentReviewsConfigModel>(
      {url: `/umbraco/workflow/management/api/v1/content-review/config`, method: 'GET'
    },
      options);
    }
  
const putContentReviewConfig = (
    contentReviewsSaveSettingsModel: ContentReviewsSaveSettingsModel,
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<ContentReviewsConfigModel>(
      {url: `/umbraco/workflow/management/api/v1/content-review/config`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: contentReviewsSaveSettingsModel
    },
      options);
    }
  
const postContentReviewNodes = (
    workflowSearchRequestModel: WorkflowSearchRequestModel,
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<PagedContentReviewCollectionResponseModel>(
      {url: `/umbraco/workflow/management/api/v1/content-review/nodes`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: workflowSearchRequestModel
    },
      options);
    }
  
const putContentReviewReview = (
    contentReviewRequestModel: ContentReviewRequestModel,
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<void>(
      {url: `/umbraco/workflow/management/api/v1/content-review/review`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: contentReviewRequestModel
    },
      options);
    }
  
const getContentReviewSeed = (
    
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<void>(
      {url: `/umbraco/workflow/management/api/v1/content-review/seed`, method: 'GET'
    },
      options);
    }
  
const getContentContentSlim = (
    params?: GetContentContentSlimParams,
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<ContentSlimModel[]>(
      {url: `/umbraco/workflow/management/api/v1/content/content-slim`, method: 'GET',
        params
    },
      options);
    }
  
const getContentContentTypes = (
    
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<ContentTypePropertyModel[]>(
      {url: `/umbraco/workflow/management/api/v1/content/content-types`, method: 'GET'
    },
      options);
    }
  
const getContentDiff = (
    params?: GetContentDiffParams,
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<WorkflowDiffsModel>(
      {url: `/umbraco/workflow/management/api/v1/content/diff`, method: 'GET',
        params
    },
      options);
    }
  
const getEmailTemplateInstall = (
    
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<string[]>(
      {url: `/umbraco/workflow/management/api/v1/email-template/install`, method: 'GET'
    },
      options);
    }
  
const getHistoryCleanup = (
    params?: GetHistoryCleanupParams,
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<HistoryCleanupModel>(
      {url: `/umbraco/workflow/management/api/v1/history-cleanup`, method: 'GET',
        params
    },
      options);
    }
  
const putHistoryCleanup = (
    putHistoryCleanupBody: PutHistoryCleanupBody,
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<void>(
      {url: `/umbraco/workflow/management/api/v1/history-cleanup`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: putHistoryCleanupBody
    },
      options);
    }
  
const getInstance = (
    params?: GetInstanceParams,
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<WorkflowInstanceResponseModel>(
      {url: `/umbraco/workflow/management/api/v1/instance`, method: 'GET',
        params
    },
      options);
    }
  
const postInstanceActive = (
    workflowSearchRequestModel: WorkflowSearchRequestModel,
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<PagedWorkflowInstanceTableResponseModel>(
      {url: `/umbraco/workflow/management/api/v1/instance/active`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: workflowSearchRequestModel
    },
      options);
    }
  
const postInstanceAll = (
    workflowSearchRequestModel: WorkflowSearchRequestModel,
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<PagedWorkflowInstanceTableResponseModel>(
      {url: `/umbraco/workflow/management/api/v1/instance/all`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: workflowSearchRequestModel
    },
      options);
    }
  
const postInstanceAssignedTo = (
    workflowSearchRequestModel: WorkflowSearchRequestModel,
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<PagedWorkflowInstanceTableResponseModel>(
      {url: `/umbraco/workflow/management/api/v1/instance/assigned-to`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: workflowSearchRequestModel
    },
      options);
    }
  
const postInstanceInitiatedBy = (
    workflowSearchRequestModel: WorkflowSearchRequestModel,
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<PagedWorkflowInstanceTableResponseModel>(
      {url: `/umbraco/workflow/management/api/v1/instance/initiated-by`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: workflowSearchRequestModel
    },
      options);
    }
  
const getInstanceStatus = (
    params?: GetInstanceStatusParams,
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<GetInstanceStatus200>(
      {url: `/umbraco/workflow/management/api/v1/instance/status`, method: 'GET',
        params
    },
      options);
    }
  
const getScaffold = (
    params?: GetScaffoldParams,
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<WorkflowScaffoldResponseModel>(
      {url: `/umbraco/workflow/management/api/v1/scaffold`, method: 'GET',
        params
    },
      options);
    }
  
const getInformation = (
    
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<WorkflowInformationResponseModel>(
      {url: `/umbraco/workflow/management/api/v1/information`, method: 'GET'
    },
      options);
    }
  
const getSettings = (
    
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<WorkflowSettingsPropertiesModel>(
      {url: `/umbraco/workflow/management/api/v1/settings`, method: 'GET'
    },
      options);
    }
  
const putSettings = (
    workflowSettingsPropertiesModel: WorkflowSettingsPropertiesModel,
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<WorkflowSettingsPropertiesModel>(
      {url: `/umbraco/workflow/management/api/v1/settings`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: workflowSettingsPropertiesModel
    },
      options);
    }
  
const getSettingsVersion = (
    
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<PackageVersionModel>(
      {url: `/umbraco/workflow/management/api/v1/settings/version`, method: 'GET'
    },
      options);
    }
  
const getTaskById = (
    id: string,
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<WorkflowTasksForInstanceResponseModel>(
      {url: `/umbraco/workflow/management/api/v1/task/${id}`, method: 'GET'
    },
      options);
    }
  
const getTaskActiveVariantsById = (
    id: string,
 options?: SecondParameter<typeof UmbracoWorkflowClient>,) => {
      return UmbracoWorkflowClient<string[]>(
      {url: `/umbraco/workflow/management/api/v1/task/active-variants/${id}`, method: 'GET'
    },
      options);
    }
  
return {postActionApprove,postActionCancel,postActionInitiate,postActionReject,postActionResubmit,getAdvancedSearchContentTypes,postAdvancedSearchSearch,postApprovalGroup,getApprovalGroup,getApprovalGroupById,deleteApprovalGroupById,putApprovalGroupById,getApprovalGroupInheritedMembers,getApprovalGroupScaffold,getItemApprovalGroup,getChartContentReviewChart,getChartWorkflowChart,putConfig,postConfigUnlock,getContentReviewConfig,putContentReviewConfig,postContentReviewNodes,putContentReviewReview,getContentReviewSeed,getContentContentSlim,getContentContentTypes,getContentDiff,getEmailTemplateInstall,getHistoryCleanup,putHistoryCleanup,getInstance,postInstanceActive,postInstanceAll,postInstanceAssignedTo,postInstanceInitiatedBy,getInstanceStatus,getScaffold,getInformation,getSettings,putSettings,getSettingsVersion,getTaskById,getTaskActiveVariantsById}};
export type PostActionApproveResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['postActionApprove']>>>
export type PostActionCancelResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['postActionCancel']>>>
export type PostActionInitiateResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['postActionInitiate']>>>
export type PostActionRejectResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['postActionReject']>>>
export type PostActionResubmitResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['postActionResubmit']>>>
export type GetAdvancedSearchContentTypesResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['getAdvancedSearchContentTypes']>>>
export type PostAdvancedSearchSearchResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['postAdvancedSearchSearch']>>>
export type PostApprovalGroupResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['postApprovalGroup']>>>
export type GetApprovalGroupResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['getApprovalGroup']>>>
export type GetApprovalGroupByIdResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['getApprovalGroupById']>>>
export type DeleteApprovalGroupByIdResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['deleteApprovalGroupById']>>>
export type PutApprovalGroupByIdResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['putApprovalGroupById']>>>
export type GetApprovalGroupInheritedMembersResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['getApprovalGroupInheritedMembers']>>>
export type GetApprovalGroupScaffoldResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['getApprovalGroupScaffold']>>>
export type GetItemApprovalGroupResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['getItemApprovalGroup']>>>
export type GetChartContentReviewChartResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['getChartContentReviewChart']>>>
export type GetChartWorkflowChartResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['getChartWorkflowChart']>>>
export type PutConfigResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['putConfig']>>>
export type PostConfigUnlockResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['postConfigUnlock']>>>
export type GetContentReviewConfigResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['getContentReviewConfig']>>>
export type PutContentReviewConfigResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['putContentReviewConfig']>>>
export type PostContentReviewNodesResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['postContentReviewNodes']>>>
export type PutContentReviewReviewResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['putContentReviewReview']>>>
export type GetContentReviewSeedResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['getContentReviewSeed']>>>
export type GetContentContentSlimResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['getContentContentSlim']>>>
export type GetContentContentTypesResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['getContentContentTypes']>>>
export type GetContentDiffResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['getContentDiff']>>>
export type GetEmailTemplateInstallResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['getEmailTemplateInstall']>>>
export type GetHistoryCleanupResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['getHistoryCleanup']>>>
export type PutHistoryCleanupResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['putHistoryCleanup']>>>
export type GetInstanceResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['getInstance']>>>
export type PostInstanceActiveResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['postInstanceActive']>>>
export type PostInstanceAllResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['postInstanceAll']>>>
export type PostInstanceAssignedToResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['postInstanceAssignedTo']>>>
export type PostInstanceInitiatedByResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['postInstanceInitiatedBy']>>>
export type GetInstanceStatusResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['getInstanceStatus']>>>
export type GetScaffoldResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['getScaffold']>>>
export type GetInformationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['getInformation']>>>
export type GetSettingsResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['getSettings']>>>
export type PutSettingsResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['putSettings']>>>
export type GetSettingsVersionResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['getSettingsVersion']>>>
export type GetTaskByIdResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['getTaskById']>>>
export type GetTaskActiveVariantsByIdResult = NonNullable<Awaited<ReturnType<ReturnType<typeof getUmbracoWorkflowManagementAPI>['getTaskActiveVariantsById']>>>
