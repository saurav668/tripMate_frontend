
import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";

import { store } from "../app/store";
import { authSuccess, logout } from "../features/auth/authSlice";
import type { AuthTokens } from "../features/auth/authApi";

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<string> | null = null;

function clearAuthentication() {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");

  store.dispatch(logout());

  if (window.location.pathname !== "/auth") {
    window.location.assign("/auth");
  }
}

// Attach access token to every API request.
api.interceptors.request.use((config) => {
  const accessToken = sessionStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Handle expired access tokens.
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config as RetryConfig | undefined;

    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url ?? "";

    // Do not refresh for authentication endpoints.
    const authEndpoints = [
      "/auth/login",
      "/auth/register",
      "/auth/refresh",
      "/auth/logout",
    ];

    if (authEndpoints.some((endpoint) => requestUrl.includes(endpoint))) {
      return Promise.reject(error);
    }

    // Prevent retry loops.
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = sessionStorage.getItem("refreshToken");

    if (!refreshToken) {
      clearAuthentication();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = axios
          .post<AuthTokens>(
            `${baseURL}/auth/refresh`,
            { refreshToken },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            const tokens = response.data;

            if (!tokens.accessToken || !tokens.refreshToken) {
              throw new Error("Invalid refresh token response");
            }

            sessionStorage.setItem("accessToken", tokens.accessToken);
            sessionStorage.setItem("refreshToken", tokens.refreshToken);

            store.dispatch(authSuccess(tokens));

            return tokens.accessToken;
          })
          .catch((refreshError) => {
            clearAuthentication();
            throw refreshError;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newAccessToken = await refreshPromise;

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);
