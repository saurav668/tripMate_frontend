
import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";

import { loginApi, registerApi } from "./authApi";
import type { LoginPayload, RegisterPayload, AuthTokens } from "./authApi";

import {
  authFailure,
  authLoading,
  authSuccess,
  loginRequest,
  registerRequest,
  registrationCompleted,
} from "./authSlice";

function getErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: { message?: string | string[] };
        };
      }
    ).response;

    const message = response?.data?.message;

    if (Array.isArray(message)) return message.join(", ");
    if (message) return message;
  }

  return "Something went wrong. Please try again.";
}

function* loginWorker(action: PayloadAction<LoginPayload>) {
  try {
    yield put(authLoading());

    const tokens: AuthTokens = yield call(loginApi, action.payload);

    sessionStorage.setItem("accessToken", tokens.accessToken);
    sessionStorage.setItem("refreshToken", tokens.refreshToken);

    yield put(authSuccess(tokens));
  } catch (error: unknown) {
    yield put(authFailure(getErrorMessage(error)));
  }
}

function* registerWorker(action: PayloadAction<RegisterPayload>) {
  try {
    yield put(authLoading());

    yield call(registerApi, action.payload);

    yield put(registrationCompleted());
  } catch (error: unknown) {
    yield put(authFailure(getErrorMessage(error)));
  }
}

export function* authSaga() {
  yield takeLatest(loginRequest.type, loginWorker);
  yield takeLatest(registerRequest.type, registerWorker);
}
