import { api } from "../../services/api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthTokens {
  message: string;
  accessToken: string;
  refreshToken: string;
}

export const loginApi = async (
  payload: LoginPayload
): Promise<AuthTokens> => {
  const response = await api.post<AuthTokens>("/auth/login", payload);
  return response.data;
};

export const registerApi = async (
  payload: RegisterPayload
): Promise<AuthTokens> => {
  const response = await api.post<AuthTokens>("/auth/register", payload);
  return response.data;
};

export const refreshTokenApi = async (
  refreshToken: string
): Promise<AuthTokens> => {
  const response = await api.post<AuthTokens>("/auth/refresh", {
    refreshToken,
  });
  return response.data;
};

export const logoutApi = async (refreshToken: string) => {
  const response = await api.post("/auth/logout", { refreshToken });
  return response.data;
};

export const getProfileApi = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};