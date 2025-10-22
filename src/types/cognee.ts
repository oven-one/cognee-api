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

export enum PipelineRunStatus {
  DATASET_PROCESSING_INITIATED = 'DATASET_PROCESSING_INITIATED',
  DATASET_PROCESSING_STARTED = 'DATASET_PROCESSING_STARTED',
  DATASET_PROCESSING_COMPLETED = 'DATASET_PROCESSING_COMPLETED',
  DATASET_PROCESSING_ERRORED = 'DATASET_PROCESSING_ERRORED',
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

export type PipelineRunInfo = {
  readonly status: string;
  readonly pipeline_run_id: UUID;
  readonly dataset_id: UUID;
  readonly dataset_name: string;
  readonly payload: Record<string, unknown>;
  readonly data_ingestion_info: readonly unknown[];
};

export type DatasetDTO = {
  readonly id: UUID;
  readonly name: string;
  readonly created_at: DateTime;
  readonly updated_at: DateTime | null;
  readonly owner_id: UUID;
};

export type DataDTO = {
  readonly id: UUID;
  readonly name: string;
  readonly createdAt: DateTime;
  readonly updatedAt: DateTime;
  readonly extension: string;
  readonly mimeType: string;
  readonly rawDataLocation: string;
  readonly datasetId: UUID;
  readonly nodeSet?: readonly string[];
};

export type GraphNode = {
  readonly id: UUID;
  readonly label: string;
  readonly type?: string;
  readonly properties: Record<string, unknown>;
};

export type GraphEdge = {
  readonly source: UUID;
  readonly target: UUID;
  readonly label: string;
};

export type GraphDTO = {
  readonly nodes: readonly GraphNode[];
  readonly edges: readonly GraphEdge[];
};

// ============================================================================
// Request Types
// ============================================================================

export type AddDataRequest = {
  readonly datasetName?: string;
  readonly datasetId?: UUID;
  readonly node_set?: readonly string[];
};

export type CognifyRequest = {
  readonly datasets?: readonly string[];
  readonly dataset_ids?: readonly UUID[];
  readonly run_in_background?: boolean;
  readonly custom_prompt?: string;
};

export type CreateDatasetRequest = {
  readonly name: string;
};

export type SearchRequest = {
  readonly query: string;
  readonly searchType?: SearchType;
  readonly datasets?: readonly string[];
  readonly datasetIds?: readonly UUID[];
  readonly datasetName?: string;
  readonly systemPrompt?: string;
  readonly nodeName?: readonly string[];
  readonly topK?: number;
  readonly onlyContext?: boolean;
  readonly useCombinedContext?: boolean;
};

export type LoginRequest = {
  readonly username: string;
  readonly password: string;
};

export type MemifyRequest = {
  readonly extraction_tasks?: readonly string[];
  readonly enrichment_tasks?: readonly string[];
  readonly data?: string;
  readonly dataset_name?: string;
  readonly dataset_id?: UUID;
  readonly node_name?: readonly string[];
  readonly run_in_background?: boolean;
};

export type CodeIndexRequest = {
  readonly repo_path: string;
  readonly include_docs: boolean;
};

export type CodeRetrieveRequest = {
  readonly query: string;
  readonly full_input: string;
};

export type GrantPermissionRequest = {
  readonly permission_name: string;
  readonly dataset_ids: readonly UUID[];
};

export type CreateRoleRequest = {
  readonly role_name: string;
};

export type AddUserToRoleRequest = {
  readonly role_id: UUID;
};

export type AddUserToTenantRequest = {
  readonly tenant_id: UUID;
};

export type CreateTenantRequest = {
  readonly tenant_name: string;
};

export type RoleRead = {
  readonly id: UUID;
  readonly name: string;
  readonly tenant_id: UUID;
};

export type SyncRequest = {
  readonly dataset_ids?: readonly UUID[];
};

export type LLMConfigInput = {
  readonly provider: 'openai' | 'ollama' | 'anthropic' | 'gemini';
  readonly model: string;
  readonly apiKey: string;
};

export type VectorDBConfigInput = {
  readonly provider: 'lancedb' | 'chromadb' | 'pgvector';
  readonly url: string;
  readonly apiKey: string;
};

export type SettingsRequest = {
  readonly llm?: LLMConfigInput;
  readonly vectorDb?: VectorDBConfigInput;
};

export type RegisterRequest = {
  readonly email: string;
  readonly password: string;
  readonly is_active?: boolean;
  readonly is_superuser?: boolean;
  readonly is_verified?: boolean;
  readonly tenant_id?: UUID;
};

export type ForgotPasswordRequest = {
  readonly email: string;
};

export type ResetPasswordRequest = {
  readonly token: string;
  readonly password: string;
};

export type VerifyRequest = {
  readonly token: string;
};

export type RequestVerifyTokenRequest = {
  readonly email: string;
};

export type UserUpdateRequest = {
  readonly password?: string;
  readonly email?: string;
  readonly is_active?: boolean;
  readonly is_superuser?: boolean;
  readonly is_verified?: boolean;
};

export type NotebookCell = {
  readonly id: UUID;
  readonly type: 'markdown' | 'code';
  readonly name: string;
  readonly content: string;
};

export type NotebookData = {
  readonly name: string;
  readonly cells?: readonly NotebookCell[];
};

export type RunCodeData = {
  readonly content: string;
};

export type ResponseFunction = {
  readonly name: string;
  readonly description: string;
  readonly parameters: {
    readonly type: string;
    readonly properties: Record<string, unknown>;
    readonly required?: readonly string[];
  };
};

export type ResponseToolFunction = {
  readonly type: 'function';
  readonly function: ResponseFunction;
};

export type ResponseRequest = {
  readonly model?: 'cognee-v1';
  readonly input: string;
  readonly tools?: readonly ResponseToolFunction[];
  readonly toolChoice?: string | Record<string, unknown>;
  readonly user?: string;
  readonly temperature?: number;
  readonly maxCompletionTokens?: number;
};

// ============================================================================
// Response Types
// ============================================================================

export type UserRead = {
  readonly id: UUID;
  readonly email: string;
  readonly is_active: boolean;
  readonly is_superuser: boolean;
  readonly is_verified: boolean;
  readonly tenant_id?: UUID;
};

export type SearchHistoryItem = {
  readonly id: UUID;
  readonly text: string;
  readonly user: string;
  readonly createdAt: DateTime;
};

export type ConfigChoice = {
  readonly value: string;
  readonly label: string;
};

export type LLMConfigOutput = {
  readonly apiKey: string;
  readonly model: string;
  readonly provider: string;
  readonly endpoint?: string;
  readonly apiVersion?: string;
  readonly models: Record<string, readonly ConfigChoice[]>;
  readonly providers: readonly ConfigChoice[];
};

export type VectorDBConfigOutput = {
  readonly apiKey: string;
  readonly url: string;
  readonly provider: string;
  readonly providers: readonly ConfigChoice[];
};

export type SettingsDTO = {
  readonly llm: LLMConfigOutput;
  readonly vectorDb: VectorDBConfigOutput;
};

export type SyncResponse = {
  readonly run_id: string;
  readonly status: string;
  readonly dataset_ids: readonly string[];
  readonly dataset_names: readonly string[];
  readonly message: string;
  readonly timestamp: string;
  readonly user_id: string;
};

export type SyncStatusOverview = {
  readonly has_running_sync: boolean;
  readonly running_sync_count: number;
  readonly latest_running_sync?: {
    readonly run_id: string;
    readonly dataset_name: string;
    readonly progress_percentage: number;
    readonly created_at: string;
  };
};

export type SearchResultDataset = {
  readonly id: UUID;
  readonly name: string;
};

export type CombinedSearchResult = {
  readonly result: unknown;
  readonly context: Record<string, unknown>;
  readonly graphs?: Record<string, unknown>;
  readonly datasets?: readonly SearchResultDataset[];
};

export type SearchResult = {
  readonly search_result: unknown;
  readonly dataset_id: UUID | null;
  readonly dataset_name: string | null;
};

export type CognifyResponse = {
  readonly [datasetId: string]: PipelineRunInfo;
};

export type DatasetStatusResponse = {
  readonly [datasetId: string]: PipelineRunStatus;
};

export type ResponseFunctionCall = {
  readonly name: string;
  // eslint-disable-next-line functional/functional-parameters
  readonly arguments: string;
};

export type ResponseToolCallOutput = {
  readonly status: string;
  readonly data?: Record<string, unknown>;
};

export type ResponseToolCall = {
  readonly id: string;
  readonly type: 'function';
  readonly function: ResponseFunctionCall;
  readonly output?: ResponseToolCallOutput;
};

export type ChatUsage = {
  readonly prompt_tokens: number;
  readonly completion_tokens: number;
  readonly total_tokens: number;
};

export type ResponseBody = {
  readonly id: string;
  readonly created: number;
  readonly model: string;
  readonly object: string;
  readonly status: string;
  readonly toolCalls: readonly ResponseToolCall[];
  readonly usage?: ChatUsage;
  readonly metadata: Record<string, unknown>;
};

export type ErrorResponseDTO = {
  readonly message: string;
};

export type HealthResponse = {
  readonly status: string;
};

export type DetailedHealthResponse = {
  readonly status: string;
  readonly components?: Record<string, unknown>;
};

// ============================================================================
// Error Types
// ============================================================================

export type CogneeErrorResponse = {
  readonly message: string;
  readonly name?: string;
  readonly status_code?: number;
};

// eslint-disable-next-line functional/no-class
export class CogneeError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly response?: CogneeErrorResponse
  ) {
    super(message);
    // eslint-disable-next-line functional/no-this-expression
    this.name = 'CogneeError';
  }
}
