import "server-only";
import { HttpClient } from "./lib/http-client";
import { getValidSession } from "../auth/server";

const API = HttpClient.create({
  baseURL: process.env.API_URL,
  withCredentials: true,
  timeout: 10000,
});

API.interceptors.request.use(async (request) => {
  const session = await getValidSession();

  request.headers = {
    ...request.headers,
    Authorization: `Bearer ${session?.accessToken || ""}`,
  };

  return request;
});

export { API };
