import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.statusText ||
      error?.message ||
      "Erro ao chamar a API";
    return Promise.reject(new Error(message));
  },
);

export const api = {
  get: <T>(url: string, config?: Parameters<typeof apiClient.get>[1]) =>
    apiClient.get<T>(url, config).then((res) => res.data),
  post: <T>(url: string, data?: unknown, config?: Parameters<typeof apiClient.post>[2]) =>
    apiClient.post<T>(url, data, config).then((res) => res.data),
  put: <T>(url: string, data?: unknown, config?: Parameters<typeof apiClient.put>[2]) =>
    apiClient.put<T>(url, data, config).then((res) => res.data),
  patch: <T>(url: string, data?: unknown, config?: Parameters<typeof apiClient.patch>[2]) =>
    apiClient.patch<T>(url, data, config).then((res) => res.data),
  delete: <T>(url: string, config?: Parameters<typeof apiClient.delete>[1]) =>
    apiClient.delete<T>(url, config).then((res) => res.data),
};

// 
export const productApi = {
  create: (data: unknown) => api.post("/products", data),
  get: (id: string) => api.get(`/products/${id}`),
  list: () => api.get("/products"),
  update: (id: string, data: unknown) => api.patch(`/products/${id}`, data),
  remove: (id: string) => api.delete(`/products/${id}`),
};

export const userApi = {
  create: (data: unknown) => api.post("/users", data),
  get: (id: string) => api.get(`/users/${id}`),
  list: () => api.get("/users"),
  remove: (id: string) => api.delete(`/users/${id}`),
};

export const collectionApi = {
  create: (data: unknown) => api.post("/collections", data),
  get: (id: string) => api.get(`/collections/${id}`),
  list: () => api.get("/collections"),
  remove: (id: string) => api.delete(`/collections/${id}`),
};
