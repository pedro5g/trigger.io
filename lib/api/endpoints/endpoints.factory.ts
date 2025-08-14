import type {
  ApiForgotPasswordBody,
  ApiForgotPasswordResponse,
  ApiResetPasswordBody,
  ApiResetPasswordResponse,
  ApiSignInBody,
  ApiSignInResponse,
  ApiSignUpBody,
  ApiSignUpResponse,
  ApiUserProfileResponse,
} from "./endpoints.types";
import { safeHttpClient, type HttpClient } from "../lib/http-client";

export function createEndpoints(API: HttpClient) {
  const ApiSignUp = async <B extends ApiSignUpBody>(body: B) => {
    return safeHttpClient(() =>
      API.post<ApiSignUpResponse, B>("/auth/register", body, {
        skipRequestInterceptors: true,
      }),
    );
  };

  const ApiSignIn = async <B extends ApiSignInBody>(body: B) => {
    return safeHttpClient(() =>
      API.post<ApiSignInResponse, B>("/auth/login", body, {
        skipRequestInterceptors: true,
      }),
    );
  };

  const ApiForgotPassword = async <B extends ApiForgotPasswordBody>(
    body: B,
  ) => {
    return safeHttpClient(() =>
      API.post<ApiForgotPasswordResponse, B>("/auth/forgot-password", body, {
        skipRequestInterceptors: true,
      }),
    );
  };

  const ApiResetPassword = async <B extends ApiResetPasswordBody>(body: B) => {
    return safeHttpClient(() =>
      API.put<ApiResetPasswordResponse, B>("/auth/reset-password", body, {
        skipRequestInterceptors: true,
      }),
    );
  };

  const ApiUserProfile = async () => {
    return safeHttpClient(() =>
      API.get<ApiUserProfileResponse>("/user/me", {
        next: {
          revalidate: 600000,
          tags: ["user"],
        },
      }),
    );
  };

  return {
    ApiSignIn,
    ApiSignUp,
    ApiForgotPassword,
    ApiResetPassword,
    ApiUserProfile,
  };
}
