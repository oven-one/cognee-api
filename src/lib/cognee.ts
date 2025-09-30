/**
 * Cognee API Client
 * Functional TypeScript client for the Cognee API
 */

import {
  AddDataRequest,
  CodeIndexRequest,
  CodeRetrieveRequest,
  CogneeError,
  CogneeErrorResponse,
  CognifyRequest,
  CognifyResponse,
  CreateDatasetRequest,
  DataDTO,
  DatasetDTO,
  DatasetStatusResponse,
  GraphDTO,
  LoginRequest,
  MemifyRequest,
  PipelineRunInfo,
  SearchRequest,
  SearchResult,
  SettingsRequest,
  SyncRequest,
  UUID,
} from '../types/cognee';

// ============================================================================
// Configuration
// ============================================================================

export interface CogneeConfig {
  readonly baseUrl: string;
  readonly apiKey?: string;
  readonly authToken?: string;
}

// ============================================================================
// HTTP Helper
// ============================================================================

const createHeaders = (config: CogneeConfig, isFormData: boolean = false): HeadersInit => {
  const headers: HeadersInit = {};

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (config.apiKey) {
    headers['X-Api-Key'] = config.apiKey;
  }

  return headers;
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: response.statusText })) as CogneeErrorResponse;
    throw new CogneeError(
      errorBody.message || `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      errorBody
    );
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json() as Promise<T>;
  }

  return response.text() as Promise<T>;
};

const fetchWithConfig = async <T>(
  config: CogneeConfig,
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${config.baseUrl}/api/v1${path}`;
  const isFormData = options.body instanceof FormData;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...createHeaders(config, isFormData),
      ...options.headers,
    },
    credentials: 'include', // Include cookies for auth_token
  });

  return handleResponse<T>(response);
};

// ============================================================================
// Authentication
// ============================================================================

export const login = async (
  config: CogneeConfig,
  credentials: LoginRequest
): Promise<void> => {
  return fetchWithConfig(config, '/auth/jwt/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const getCurrentUser = async (config: CogneeConfig): Promise<unknown> => {
  return fetchWithConfig(config, '/users/me', {
    method: 'GET',
  });
};

// ============================================================================
// Add Data
// ============================================================================

export const addData = async (
  config: CogneeConfig,
  files: File[],
  request: AddDataRequest = {}
): Promise<PipelineRunInfo> => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('data', file);
  });

  if (request.datasetName) {
    formData.append('datasetName', request.datasetName);
  }

  if (request.datasetId) {
    formData.append('datasetId', request.datasetId);
  }

  if (request.node_set) {
    request.node_set.forEach((nodeSet) => {
      formData.append('node_set', nodeSet);
    });
  }

  return fetchWithConfig(config, '/add', {
    method: 'POST',
    body: formData,
  });
};

// ============================================================================
// Cognify
// ============================================================================

export const cognify = async (
  config: CogneeConfig,
  request: CognifyRequest = {}
): Promise<CognifyResponse> => {
  return fetchWithConfig(config, '/cognify', {
    method: 'POST',
    body: JSON.stringify(request),
  });
};

export const codeIndex = async (
  config: CogneeConfig,
  request: CodeIndexRequest
): Promise<void> => {
  return fetchWithConfig(config, '/cognify/index', {
    method: 'POST',
    body: JSON.stringify(request),
  });
};

export const codeRetrieve = async (
  config: CogneeConfig,
  request: CodeRetrieveRequest
): Promise<unknown> => {
  return fetchWithConfig(config, '/cognify/retrieve', {
    method: 'POST',
    body: JSON.stringify(request),
  });
};

// ============================================================================
// Datasets
// ============================================================================

export const getDatasets = async (config: CogneeConfig): Promise<readonly DatasetDTO[]> => {
  return fetchWithConfig(config, '/datasets', {
    method: 'GET',
  });
};

export const createDataset = async (
  config: CogneeConfig,
  request: CreateDatasetRequest
): Promise<DatasetDTO> => {
  return fetchWithConfig(config, '/datasets', {
    method: 'POST',
    body: JSON.stringify(request),
  });
};

export const deleteDataset = async (
  config: CogneeConfig,
  datasetId: UUID
): Promise<void> => {
  return fetchWithConfig(config, `/datasets/${datasetId}`, {
    method: 'DELETE',
  });
};

export const getDatasetGraph = async (
  config: CogneeConfig,
  datasetId: UUID
): Promise<GraphDTO> => {
  return fetchWithConfig(config, `/datasets/${datasetId}/graph`, {
    method: 'GET',
  });
};

export const getDatasetData = async (
  config: CogneeConfig,
  datasetId: UUID
): Promise<readonly DataDTO[]> => {
  return fetchWithConfig(config, `/datasets/${datasetId}/data`, {
    method: 'GET',
  });
};

export const getDatasetStatus = async (
  config: CogneeConfig,
  datasetIds: readonly UUID[]
): Promise<DatasetStatusResponse> => {
  const params = new URLSearchParams();
  datasetIds.forEach((id) => params.append('dataset', id));

  return fetchWithConfig(config, `/datasets/status?${params.toString()}`, {
    method: 'GET',
  });
};

export const deleteDatasetDataItem = async (
  config: CogneeConfig,
  datasetId: UUID,
  dataId: UUID
): Promise<void> => {
  return fetchWithConfig(config, `/datasets/${datasetId}/data/${dataId}`, {
    method: 'DELETE',
  });
};

export const getRawDataFile = async (
  config: CogneeConfig,
  datasetId: UUID,
  dataId: UUID
): Promise<Blob> => {
  const url = `${config.baseUrl}/api/v1/datasets/${datasetId}/data/${dataId}/raw`;
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: createHeaders(config),
  });

  if (!response.ok) {
    throw new CogneeError(`Failed to download file: ${response.statusText}`, response.status);
  }

  return response.blob();
};

// ============================================================================
// Search
// ============================================================================

export const search = async (
  config: CogneeConfig,
  request: SearchRequest
): Promise<readonly SearchResult[]> => {
  return fetchWithConfig(config, '/search', {
    method: 'POST',
    body: JSON.stringify(request),
  });
};

export const getSearchHistory = async (config: CogneeConfig): Promise<unknown> => {
  return fetchWithConfig(config, '/search', {
    method: 'GET',
  });
};

// ============================================================================
// Memify
// ============================================================================

export const memify = async (
  config: CogneeConfig,
  request: MemifyRequest
): Promise<unknown> => {
  return fetchWithConfig(config, '/memify', {
    method: 'POST',
    body: JSON.stringify(request),
  });
};

// ============================================================================
// Settings
// ============================================================================

export const getSettings = async (config: CogneeConfig): Promise<unknown> => {
  return fetchWithConfig(config, '/settings', {
    method: 'GET',
  });
};

export const saveSettings = async (
  config: CogneeConfig,
  request: SettingsRequest
): Promise<unknown> => {
  return fetchWithConfig(config, '/settings', {
    method: 'POST',
    body: JSON.stringify(request),
  });
};

// ============================================================================
// Sync
// ============================================================================

export const sync = async (
  config: CogneeConfig,
  request: SyncRequest
): Promise<unknown> => {
  return fetchWithConfig(config, '/sync', {
    method: 'POST',
    body: JSON.stringify(request),
  });
};

export const getSyncStatus = async (config: CogneeConfig): Promise<unknown> => {
  return fetchWithConfig(config, '/sync/status', {
    method: 'GET',
  });
};

// ============================================================================
// Delete
// ============================================================================

export const deleteData = async (
  config: CogneeConfig,
  datasetId: UUID,
  dataId: UUID,
  mode: 'soft' | 'hard' = 'soft'
): Promise<void> => {
  const params = new URLSearchParams({
    dataset_id: datasetId,
    data_id: dataId,
    mode,
  });

  return fetchWithConfig(config, `/delete?${params.toString()}`, {
    method: 'DELETE',
  });
};

// ============================================================================
// Visualize
// ============================================================================

export const visualizeDataset = async (
  config: CogneeConfig,
  datasetId: UUID
): Promise<string> => {
  const params = new URLSearchParams({ dataset_id: datasetId });
  return fetchWithConfig(config, `/visualize?${params.toString()}`, {
    method: 'GET',
  });
};

// ============================================================================
// Cloud Connection
// ============================================================================

export const checkCloudConnection = async (
  config: CogneeConfig
): Promise<unknown> => {
  return fetchWithConfig(config, '/cloud/connection', {
    method: 'POST',
  });
};