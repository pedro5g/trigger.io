type UserStatus = "active" | "inactive" | "suspended";
export type User = {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  email_verified_at: Date | null;
  last_login_at: Date | null;
  created_at: Date;
  updated_at: Date | null;
  settings: {
    id: string;
    language: string;
    email_notifications: boolean;
    push_notifications: boolean;
    webhook_notifications: boolean;
    max_projects: number;
    max_web_hooks_per_project: number;
    max_notifications_per_month: number;
    created_at: Date;
    updated_at: Date | null;
  };
};

export type ApiBaseErrorResponse = {
  ok: false;
  message: string;
  errorCode: string;
};

export type ApiBaseResponse = {
  ok: true;
  message: string;
};

export type ApiSignUpBody = {
  name: string;
  email: string;
  password: string;
};

export type ApiSignUpResponse = ApiBaseResponse;

export type ApiSignInBody = {
  email: string;
  password: string;
};

export type ApiSignInResponse = ApiBaseResponse & {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type ApiForgotPasswordBody = {
  email: string;
};
export type ApiForgotPasswordResponse = ApiBaseResponse;

export type ApiResetPasswordBody = {
  token: string;
  password: string;
};

export type ApiResetPasswordResponse = ApiBaseResponse;

export type ApiUserProfileResponse = ApiBaseResponse & {
  user: User;
};
