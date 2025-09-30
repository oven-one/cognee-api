/**
 * Cognee API Types
 * Auto-generated TypeScript definitions for the Cognee API
 */

// ============================================================================
// Enums
// ============================================================================

export enum SearchType {
  SUMMARIES = 'SUMMARIES',
  INSIGHTS = 'INSIGHTS',
  CHUNKS = 'CHUNKS',
  RAG_COMPLETION = 'RAG_COMPLETION',
  GRAPH_COMPLETION = 'GRAPH_COMPLETION',
  GRAPH_SUMMARY_COMPLETION = 'GRAPH_SUMMARY_COMPLETION',
  CODE = 'CODE',
  CYPHER = 'CYPHER',
  NATURAL_LANGUAGE = 'NATURAL_LANGUAGE',
  GRAPH_COMPLETION_COT = 'GRAPH_COMPLETION_COT',
  GRAPH_COMPLETION_CONTEXT_EXTENSION = 'GRAPH_COMPLETION_CONTEXT_EXTENSION',
  FEELING_LUCKY = 'FEELING_LUCKY',
  FEEDBACK = 'FEEDBACK',
  TEMPORAL = 'TEMPORAL',
  CODING_RULES = 'CODING_RULES',
}

export enum PipelineStatus {
  STARTED = 'PipelineRunStarted',
  YIELD = 'PipelineRunYield',
  COMPLETED = 'PipelineRunCompleted',
  ALREADY_COMPLETED = 'PipelineRunAlreadyCompleted',
  ERRORED = 'PipelineRunErrored',
}

export enum DeleteMode {
  SOFT = 'soft',
  HARD = 'hard',
}

// ============================================================================
// Base Types
// ============================================================================

export type UUID = string;
export type DateTime = string;

// ============================================================================
// DTOs
// ============================================================================

export interface PipelineRunInfo {
  readonly status: string;
  readonly pipeline_run_id: UUID;
  readonly dataset_id: UUID;
  readonly dataset_name: string;
  readonly payload: Record<string, unknown>;
  readonly data_ingestion_info: unknown[];
}

export interface DatasetDTO {
  readonly id: UUID;
  readonly name: string;
  readonly created_at: DateTime;
  readonly updated_at: DateTime | null;
  readonly owner_id: UUID;
}

export interface DataDTO {
  readonly id: UUID;
  readonly name: string;
  readonly created_at: DateTime;
  readonly updated_at: DateTime;
  readonly extension: string;
  readonly mime_type: string;
  readonly raw_data_location: string;
  readonly dataset_id: UUID;
}

export interface GraphNode {
  readonly id: UUID;
  readonly label: string;
  readonly type?: string;
  readonly properties: Record<string, unknown>;
}

export interface GraphEdge {
  readonly source: UUID;
  readonly target: UUID;
  readonly label: string;
}

export interface GraphDTO {
  readonly nodes: readonly GraphNode[];
  readonly edges: readonly GraphEdge[];
}

// ============================================================================
// Request Types
// ============================================================================

export interface AddDataRequest {
  readonly datasetName?: string;
  readonly datasetId?: UUID;
  readonly node_set?: readonly string[];
}

export interface CognifyRequest {
  readonly datasets?: readonly string[];
  readonly dataset_ids?: readonly UUID[];
  readonly run_in_background?: boolean;
  readonly custom_prompt?: string;
}

export interface CreateDatasetRequest {
  readonly name: string;
}

export interface SearchRequest {
  readonly query: string;
  readonly search_type?: SearchType;
  readonly datasets?: readonly string[];
  readonly dataset_ids?: readonly UUID[];
  readonly dataset_name?: string;
  readonly system_prompt?: string;
  readonly node_name?: readonly string[];
  readonly top_k?: number;
  readonly only_context?: boolean;
  readonly use_combined_context?: boolean;
}

export interface LoginRequest {
  readonly username: string;
  readonly password: string;
}

export interface MemifyRequest {
  readonly extraction_tasks?: readonly string[];
  readonly enrichment_tasks?: readonly string[];
  readonly data?: string;
  readonly dataset_name?: string;
  readonly dataset_id?: UUID;
  readonly node_name?: readonly string[];
  readonly run_in_background?: boolean;
}

export interface CodeIndexRequest {
  readonly repo_path: string;
  readonly include_docs: boolean;
}

export interface CodeRetrieveRequest {
  readonly query: string;
  readonly full_input: string;
}

export interface GrantPermissionRequest {
  readonly permission_name: string;
  readonly dataset_ids: readonly UUID[];
}

export interface CreateRoleRequest {
  readonly role_name: string;
}

export interface AddUserToRoleRequest {
  readonly role_id: UUID;
}

export interface AddUserToTenantRequest {
  readonly tenant_id: UUID;
}

export interface CreateTenantRequest {
  readonly tenant_name: string;
}

export interface SyncRequest {
  readonly dataset_ids: readonly UUID[];
}

export interface SettingsRequest {
  readonly llm?: {
    readonly provider?: string;
    readonly model?: string;
    readonly api_key?: string;
  };
  readonly vector_db?: {
    readonly provider?: string;
    readonly url?: string;
    readonly api_key?: string;
  };
}

// ============================================================================
// Response Types
// ============================================================================

export interface CognifyResponse {
  readonly [datasetId: string]: PipelineRunInfo;
}

export interface DatasetStatusResponse {
  readonly [datasetId: string]: string;
}

export type SearchResult = unknown;

// ============================================================================
// Error Types
// ============================================================================

export interface CogneeErrorResponse {
  readonly message: string;
  readonly name?: string;
  readonly status_code?: number;
}

export class CogneeError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly response?: CogneeErrorResponse
  ) {
    super(message);
    this.name = 'CogneeError';
  }
}