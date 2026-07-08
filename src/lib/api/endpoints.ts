/**
 * API Endpoints — Typed API layer wrapping the NestJS backend.
 *
 * All functions return Promises of the backend's typed responses.
 * The backend wraps responses in { success, data, timestamp }, and the
 * apiClient unwraps the `data` field automatically.
 */

import { apiClient } from "./client";
import type {
  Provider,
  Model,
  ApiKey,
  UsageSummary,
  LogEntry,
  HealthCheck,
  ValidationResult,
  TeamMember,
  Role,
  Permission,
  AuditLog,
  AppNotification,
  Invoice,
  BillingPlan,
  PaymentMethod,
  DocSection,
  Paginated,
} from "@/types";

// ============ Providers ============
export const providersApi = {
  list: () => apiClient.get<Provider[]>("/providers"),
  get: (id: string) => apiClient.get<Provider>(`/providers/${id}`),
  create: (data: Partial<Provider>) => apiClient.post<Provider>("/providers", data),
  update: (id: string, data: Partial<Provider>) => apiClient.patch<Provider>(`/providers/${id}`, data),
  delete: (id: string) => apiClient.delete<{ success: boolean }>(`/providers/${id}`),
  testConnection: (id: string) => apiClient.post<{ success: boolean; latencyMs: number }>(`/providers/${id}/test-connection`),
};

// ============ Models ============
export const modelsApi = {
  // Models are served via the LiteLLM proxy rather than the providers
  // controller. When a providerId is supplied we still return all
  // available models and let the client filter them. See
  // backend/modules/litellm/litellm.controller.ts for details.
  list: (providerId?: string) =>
    apiClient.get<Model[]>("/litellm/models", providerId ? { params: { providerId } } : undefined),
};

// ============ API Keys ============
export const apiKeysApi = {
  list: () => apiClient.get<ApiKey[]>("/api-keys"),
  create: (data: Partial<ApiKey>) => apiClient.post<ApiKey>("/api-keys", data),
  rotate: (id: string) => apiClient.post<{ id: string; newKey: string }>(`/api-keys/${id}/rotate`),
  revoke: (id: string) => apiClient.post<{ success: boolean }>(`/api-keys/${id}/revoke`),
};

// ============ Usage ============
export const usageApi = {
  summary: (range = "30d") => apiClient.get<UsageSummary>("/usage/summary", { params: { range } }),
  byProvider: (range = "30d") => apiClient.get("/usage/by-provider", { params: { range } }),
  byModel: (range = "30d") => apiClient.get("/usage/by-model", { params: { range } }),
  trend: (days = 30) => apiClient.get("/usage/trend", { params: { days } }),
};

// ============ Logs ============
export const logsApi = {
  list: (params?: { level?: string; providerId?: string; page?: number; pageSize?: number }) =>
    apiClient.get<Paginated<LogEntry>>("/providers/logs", { params }),
};

// ============ Health ============
export const healthApi = {
  list: () => apiClient.get<HealthCheck[]>("/providers/health"),
  runDiagnostic: (providerId: string) =>
    apiClient.post<{ providerId: string; status: string; latencyMs: number }>("/providers/health-check", { providerName: providerId }),
};

// ============ Validation ============
export const validationApi = {
  list: () => apiClient.get<ValidationResult[]>("/providers/validation-history"),
  run: (providerId: string, modelId: string) =>
    apiClient.post<{ jobId: string; status: string }>("/providers/validate-key", { providerName: providerId, modelToTest: modelId }),
};

// ============ Team ============
export const teamApi = {
  list: () => apiClient.get<TeamMember[]>("/users"),
  invite: (data: { email: string; roleId: string; name?: string }) =>
    apiClient.post<TeamMember>("/users", data),
  remove: (id: string) => apiClient.delete<{ success: boolean }>(`/users/${id}`),
};

// ============ Roles ============
export const rolesApi = {
  list: () => apiClient.get<Role[]>("/roles"),
  create: (data: Partial<Role>) => apiClient.post<Role>("/roles", data),
  delete: (id: string) => apiClient.delete<{ success: boolean }>(`/roles/${id}`),
};

// ============ Permissions ============
export const permissionsApi = {
  list: () => apiClient.get<Permission[]>("/permissions"),
};

// ============ Audit ============
export const auditApi = {
  list: (params?: { page?: number; pageSize?: number }) =>
    apiClient.get<Paginated<AuditLog>>("/audit-logs", { params }),
};

// ============ Notifications ============
export const notificationsApi = {
  list: () => apiClient.get<AppNotification[]>("/notifications"),
  markRead: (id: string) => apiClient.post<{ success: boolean }>(`/notifications/${id}/read`),
  markAllRead: () => apiClient.post<{ success: boolean }>("/notifications/read/all"),
};

// ============ Billing ============
export const billingApi = {
  plans: () => apiClient.get<BillingPlan[]>("/billing/plans"),
  invoices: () => apiClient.get<Invoice[]>("/billing/invoices"),
  paymentMethods: () => apiClient.get<PaymentMethod[]>("/billing/payments"),
  currentUsage: () => apiClient.get<UsageSummary>("/usage/summary"),
};

// ============ Documentation ============
export const docsApi = {
  list: (category?: string) =>
    apiClient.get<DocSection[]>("/docs", category ? { params: { category } } : undefined),
};
