import axios from 'axios';
import { ENV } from '@src/core/config/env';

/**
 * Pre-configured axios instance pointing at the API Gateway.
 *
 * Request interceptor: placeholder for JWT Bearer token — add token logic here
 * when auth is implemented (e.g. read from SecureStore and attach header).
 *
 * Response interceptor: normalises axios errors into a consistent Error shape
 * so upper layers don't have to import axios types.
 */
const apiClient = axios.create({
  baseURL: ENV.GATEWAY_BASE_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Auth interceptor (placeholder) ────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    // TODO: read token from SecureStore and attach when auth is needed
    // const token = await SecureStore.getItemAsync('access_token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response error normalizer ──────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message: string =
      error?.response?.data?.message ??
      error?.message ??
      'Unknown network error';
    return Promise.reject(new Error(message));
  },
);

export default apiClient;
