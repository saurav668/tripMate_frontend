
import { createAction, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  AuthTokens,
  LoginPayload,
  RegisterPayload,
} from "./authApi";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  registrationSuccess: boolean;
  authCompleted: boolean;
}

const initialState: AuthState = {
  accessToken: sessionStorage.getItem("accessToken"),
  refreshToken: sessionStorage.getItem("refreshToken"),
  loading: false,
  authCompleted: false,
  error: null,
  registrationSuccess: false,
};

export const loginRequest = createAction<LoginPayload>("auth/loginRequest");
export const registerRequest =
  createAction<RegisterPayload>("auth/registerRequest");

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authSuccess(state, action: PayloadAction<AuthTokens>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.loading = false;
      state.error = null;
      state.registrationSuccess = false;
      state.authCompleted = true;
    },

    registrationCompleted(state) {
      state.loading = false;
      state.registrationSuccess = true;
      state.error = null;
    },

    authFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    authLoading(state) {
      state.loading = true;
      state.error = null;
      state.registrationSuccess = false;
    },

    clearAuthError(state) {
      state.error = null;
    },

    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.loading = false;
      state.error = null;
      state.registrationSuccess = false;
      state.authCompleted = false;
    },
  },
});

export const {
  authSuccess,
  registrationCompleted,
  authFailure,
  authLoading,
  clearAuthError,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
