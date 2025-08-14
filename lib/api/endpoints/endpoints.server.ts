import "server-only";
import { API } from "../api.server";
import { createEndpoints } from "./endpoints.factory";

export const {
  ApiSignIn,
  ApiSignUp,
  ApiForgotPassword,
  ApiResetPassword,
  ApiUserProfile,
} = createEndpoints(API);
