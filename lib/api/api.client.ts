"use client";
import { HttpClient } from "./lib/http-client";
import { getCookie, deleteCookie, setCookie } from "../cookies";

const API = HttpClient.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 10000,
});

API.interceptors.request.use(async (request) => {
  const __token = getCookie("accessToken") || "";
  let [token, exp] = __token.split("_tm=");
  const now = Date.now();
  const margin = 20 * 1000;

  if (Number(exp) - now <= margin || !__token) {
    const res = await fetch("/api/auth");
    if (!res.ok) {
      deleteCookie("accessToken");
      window.location.href = "/sign-in";
    }
    const data = await res.json();
    setCookie("accessToken", data.cookieToken, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    request.headers = {
      ...request.headers,
      Authorization: `Bearer ${data.accessToken || ""}`,
    };
  } else {
    request.headers = {
      ...request.headers,
      Authorization: `Bearer ${token || ""}`,
    };
  }
  return request;
});

export { API };
