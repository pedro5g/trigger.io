import "server-only";
import { API } from "../api.server";
import { createEndpoints } from "./endpoints.factory";

export const {
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
} = createEndpoints(API);
