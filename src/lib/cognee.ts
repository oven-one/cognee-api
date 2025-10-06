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
  DetailedHealthResponse,
  ForgotPasswordRequest,
  GraphDTO,
  HealthResponse,
  LoginRequest,
  MemifyRequest,
  NotebookData,
  PipelineRunInfo,
  RegisterRequest,
  RequestVerifyTokenRequest,
  ResetPasswordRequest,
  ResponseBody,
  ResponseRequest,
  RoleRead,
  RunCodeData,
  SearchHistoryItem,
  SearchRequest,
  SearchResult,
  SettingsDTO,
  SettingsRequest,
  SyncRequest,
  SyncResponse,
  SyncStatusOverview,
  UserRead,
  UserUpdateRequest,
  UUID,
  VerifyRequest,
} from '../types/cognee';

// ============================================================================
// Configuration
// ============================================================================

export type CogneeConfig = {
  readonly baseUrl: string;
  readonly apiKey?: string;
  readonly authToken?: string;
};

// ============================================================================
// HTTP Helper
// ============================================================================

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

  const headers: HeadersInit = { ...options.headers };

  // Add API key if configured
  if (config.apiKey) {
    headers['X-Api-Key'] = config.apiKey;
  }

  // Add auth token if configured (for server-side usage)
  if (config.authToken) {
    headers['Authorization'] = `Bearer ${config.authToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Include cookies for auth_token (browser only)
  });

  return handleResponse<T>(response);
};

// ============================================================================
// Authentication
// ============================================================================

export const login = async (
  config: CogneeConfig,
  credentials: LoginRequest
): Promise<{ access_token: string; token_type: string }> => {
  const formData = new URLSearchParams();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);

  return fetchWithConfig(config, '/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });
};

export const logout = async (config: CogneeConfig): Promise<void> => {
  return fetchWithConfig(config, '/auth/logout', {
    method: 'POST',
  });
};

export const register = async (
  config: CogneeConfig,
  data: RegisterRequest
): Promise<UserRead> => {
  return fetchWithConfig(config, '/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const forgotPassword = async (
  config: CogneeConfig,
  data: ForgotPasswordRequest
): Promise<void> => {
  return fetchWithConfig(config, '/auth/forgot-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const resetPassword = async (
  config: CogneeConfig,
  data: ResetPasswordRequest
): Promise<void> => {
  return fetchWithConfig(config, '/auth/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const requestVerifyToken = async (
  config: CogneeConfig,
  data: RequestVerifyTokenRequest
): Promise<void> => {
  return fetchWithConfig(config, '/auth/request-verify-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const verify = async (
  config: CogneeConfig,
  data: VerifyRequest
): Promise<UserRead> => {
  return fetchWithConfig(config, '/auth/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const getCurrentUser = async (config: CogneeConfig): Promise<UserRead> => {
  return fetchWithConfig(config, '/users/me', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    }
  });
};

// ============================================================================
// Add Data
// ============================================================================

export const addData = async (
  config: CogneeConfig,
  files: readonly File[],
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
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
};

export const codeIndex = async (
  config: CogneeConfig,
  request: CodeIndexRequest
): Promise<void> => {
  return fetchWithConfig(config, '/code-pipeline/index', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
};

export const codeRetrieve = async (
  config: CogneeConfig,
  request: CodeRetrieveRequest
): Promise<readonly Record<string, unknown>[]> => {
  return fetchWithConfig(config, '/code-pipeline/retrieve', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
};

// ============================================================================
// Datasets
// ============================================================================

export const getDatasets = async (config: CogneeConfig): Promise<readonly DatasetDTO[]> => {
  return fetchWithConfig(config, '/datasets', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    }
  });
};

export const createDataset = async (
  config: CogneeConfig,
  request: CreateDatasetRequest
): Promise<DatasetDTO> => {
  return fetchWithConfig(config, '/datasets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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
    headers: {
      'Accept': 'application/json',
    }
  });
};

export const getDatasetData = async (
  config: CogneeConfig,
  datasetId: UUID
): Promise<readonly DataDTO[]> => {
  return fetchWithConfig(config, `/datasets/${datasetId}/data`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    }
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
    headers: {
      'Accept': 'application/json',
    }
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

  const headers: HeadersInit = {};
  if (config.apiKey) {
    headers['X-Api-Key'] = config.apiKey;
  }

  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers,
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
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
};

export const getSearchHistory = async (
  config: CogneeConfig
): Promise<readonly SearchHistoryItem[]> => {
  return fetchWithConfig(config, '/search', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    }
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
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
};

// ============================================================================
// Settings
// ============================================================================

export const getSettings = async (config: CogneeConfig): Promise<SettingsDTO> => {
  return fetchWithConfig(config, '/settings', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    }
  });
};

export const saveSettings = async (
  config: CogneeConfig,
  request: SettingsRequest
): Promise<void> => {
  return fetchWithConfig(config, '/settings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
};

// ============================================================================
// Sync
// ============================================================================

export const sync = async (
  config: CogneeConfig,
  request: SyncRequest = {}
): Promise<Record<string, SyncResponse>> => {
  return fetchWithConfig(config, '/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
};

export const getSyncStatus = async (config: CogneeConfig): Promise<SyncStatusOverview> => {
  return fetchWithConfig(config, '/sync/status', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    }
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
    headers: {
      'Accept': 'application/json',
    }
  });
};

// ============================================================================
// Permissions
// ============================================================================

export const grantDatasetPermissions = async (
  config: CogneeConfig,
  principalId: UUID,
  permissionName: string,
  datasetIds: readonly UUID[]
): Promise<void> => {
  const params = new URLSearchParams({ permission_name: permissionName });
  return fetchWithConfig(config, `/permissions/datasets/${principalId}?${params.toString()}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datasetIds),
  });
};

export const createRole = async (
  config: CogneeConfig,
  roleName: string
): Promise<void> => {
  const params = new URLSearchParams({ role_name: roleName });
  return fetchWithConfig(config, `/permissions/roles?${params.toString()}`, {
    method: 'POST',
  });
};

export const getRoleByName = async (
  config: CogneeConfig,
  roleName: string
): Promise<RoleRead> => {
  return fetchWithConfig(config, `/permissions/roles/${encodeURIComponent(roleName)}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    }
  });
};

export const addUserToRole = async (
  config: CogneeConfig,
  userId: UUID,
  roleId: UUID
): Promise<void> => {
  const params = new URLSearchParams({ role_id: roleId });
  return fetchWithConfig(config, `/permissions/users/${userId}/roles?${params.toString()}`, {
    method: 'POST',
  });
};

export const addUserToTenant = async (
  config: CogneeConfig,
  userId: UUID,
  tenantId: UUID
): Promise<void> => {
  const params = new URLSearchParams({ tenant_id: tenantId });
  return fetchWithConfig(config, `/permissions/users/${userId}/tenants?${params.toString()}`, {
    method: 'POST',
  });
};

export const createTenant = async (
  config: CogneeConfig,
  tenantName: string
): Promise<void> => {
  const params = new URLSearchParams({ tenant_name: tenantName });
  return fetchWithConfig(config, `/permissions/tenants?${params.toString()}`, {
    method: 'POST',
  });
};

// ============================================================================
// Users
// ============================================================================

export const updateCurrentUser = async (
  config: CogneeConfig,
  data: UserUpdateRequest
): Promise<UserRead> => {
  return fetchWithConfig(config, '/users/me', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const getUser = async (
  config: CogneeConfig,
  userId: UUID
): Promise<UserRead> => {
  return fetchWithConfig(config, `/users/${userId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    }
  });
};

export const updateUser = async (
  config: CogneeConfig,
  userId: UUID,
  data: UserUpdateRequest
): Promise<UserRead> => {
  return fetchWithConfig(config, `/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const deleteUser = async (
  config: CogneeConfig,
  userId: UUID
): Promise<void> => {
  return fetchWithConfig(config, `/users/${userId}`, {
    method: 'DELETE',
  });
};

// ============================================================================
// Notebooks
// ============================================================================

export const getNotebooks = async (config: CogneeConfig): Promise<unknown> => {
  return fetchWithConfig(config, '/notebooks', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    }
  });
};

export const createNotebook = async (
  config: CogneeConfig,
  data: NotebookData
): Promise<unknown> => {
  return fetchWithConfig(config, '/notebooks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const updateNotebook = async (
  config: CogneeConfig,
  notebookId: UUID,
  data: NotebookData
): Promise<unknown> => {
  return fetchWithConfig(config, `/notebooks/${notebookId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const deleteNotebook = async (
  config: CogneeConfig,
  notebookId: UUID
): Promise<unknown> => {
  return fetchWithConfig(config, `/notebooks/${notebookId}`, {
    method: 'DELETE',
  });
};

export const runNotebookCell = async (
  config: CogneeConfig,
  notebookId: UUID,
  cellId: UUID,
  data: RunCodeData
): Promise<unknown> => {
  return fetchWithConfig(config, `/notebooks/${notebookId}/${cellId}/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

// ============================================================================
// Responses (OpenAI-compatible)
// ============================================================================

export const createResponse = async (
  config: CogneeConfig,
  request: ResponseRequest
): Promise<ResponseBody> => {
  return fetchWithConfig(config, '/responses/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
};

// ============================================================================
// Health & Connection
// ============================================================================

export const getRoot = async (config: CogneeConfig): Promise<unknown> => {
  const url = `${config.baseUrl}/`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
    credentials: 'include',
  });
  return handleResponse<unknown>(response);
};

export const healthCheck = async (config: CogneeConfig): Promise<HealthResponse> => {
  const url = `${config.baseUrl}/health`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
    credentials: 'include',
  });
  return handleResponse<HealthResponse>(response);
};

export const detailedHealthCheck = async (
  config: CogneeConfig
): Promise<DetailedHealthResponse> => {
  const url = `${config.baseUrl}/health/detailed`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
    credentials: 'include',
  });
  return handleResponse<DetailedHealthResponse>(response);
};

export const checkConnection = async (
  config: CogneeConfig
): Promise<unknown> => {
  return fetchWithConfig(config, '/checks/connection', {
    method: 'POST',
  });
};
