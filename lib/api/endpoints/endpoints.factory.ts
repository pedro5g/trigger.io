import type {
  ApiCreateProjectBody,
  ApiCreateProjectResponse,
  ApiDisableProjectParams,
  ApiDisableProjectResponse,
  ApiForgotPasswordBody,
  ApiForgotPasswordResponse,
  ApiGetProjectParams,
  ApiGetProjectResponse,
  ApiListProjectsResponse,
  ApiResetPasswordBody,
  ApiResetPasswordResponse,
  ApiSignInBody,
  ApiSignInResponse,
  ApiSignUpBody,
  ApiSignUpResponse,
  ApiUpdateProjectBody,
  ApiUpdateProjectResponse,
  ApiUserProfileResponse,
} from "./endpoints.types";
import { safeHttpClient, type HttpClient } from "../lib/http-client";

export function createEndpoints(API: HttpClient) {
  // ### Auth endpoints
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

  // ### User endpoints
  const ApiUserProfile = async () => {
    return safeHttpClient(() =>
      API.get<ApiUserProfileResponse>("/user/me", {
        cache: "force-cache",
        next: {
          revalidate: 600000,
          tags: ["user"],
        },
      }),
    );
  };

  // ### Project endpoints
  const ApiCreateProject = async <B extends ApiCreateProjectBody>(body: B) => {
    return safeHttpClient(() =>
      API.post<ApiCreateProjectResponse, B>("/project/create", body),
    );
  };

  const ApiUpdateProject = async <B extends ApiUpdateProjectBody>({
    projectId,
    ...body
  }: B) => {
    return safeHttpClient(() =>
      API.put<ApiUpdateProjectResponse, typeof body>(
        `/project/${projectId}/update`,
        body,
      ),
    );
  };

  const ApiDisableProject = async <P extends ApiDisableProjectParams>({
    projectId,
  }: P) => {
    return safeHttpClient(() =>
      API.delete<ApiDisableProjectResponse>(`/project/${projectId}/disable`),
    );
  };

  const ApiGetProject = async <P extends ApiGetProjectParams>({
    projectId,
  }: P) => {
    return safeHttpClient(() =>
      API.get<ApiGetProjectResponse>(`/project/${projectId}get`),
    );
  };

  const ApiListProjects = async () => {
    return safeHttpClient(() =>
      API.get<ApiListProjectsResponse>(`/project/list`, {
        cache: "force-cache",
        next: {
          revalidate: 600000,
          tags: ["projects"],
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
    ApiCreateProject,
    ApiUpdateProject,
    ApiDisableProject,
    ApiGetProject,
    ApiListProjects,
  };
}
