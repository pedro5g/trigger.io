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

export type ProjectStatus = "active" | "inactive" | "suspended";
export type Project = {
  id: string;
  project_name: string;
  description: string | null;
  domain: string | null;
  icon: string | null;
  rate_limit_per_minute: number;
  rate_limit_per_hour: number;
  rate_limit_per_day: number;
  status: "active" | "inactive" | "suspended";
  webhook_secret: string;
  created_at: Date;
  updated_at: Date | null;
};

export type ApiCreateProjectBody = {
  projectName: string;
  description?: string;
  domain?: string;
  icon?: string;
};

export type ApiCreateProjectResponse = ApiBaseResponse & {
  projects: Omit<
    Project,
    | "rate_limit_per_minute"
    | "rate_limit_per_hour"
    | "rate_limit_per_day"
    | "updated_at"
  >;
};

export type ApiUpdateProjectBody = {
  projectId: string;
  projectName: string;
  description?: string;
  domain?: string;
  icon?: string;
};

export type ApiUpdateProjectResponse = ApiBaseResponse;

export type ApiDisableProjectParams = {
  projectId: string;
};

export type ApiDisableProjectResponse = ApiBaseResponse;

export type ApiListProjectsResponse = ApiBaseResponse & {
  projects: {
    id: string;
    project_name: string;
    description: string | null;
    domain: string | null;
    icon: string | null;
    status: "active" | "inactive" | "suspended";
    created_at: Date;
    updated_at: Date | null;
  }[];
};

export type ApiGetProjectParams = {
  projectId: string;
};

export type ApiGetProjectResponse = ApiBaseResponse & {
  project: Project;
};
