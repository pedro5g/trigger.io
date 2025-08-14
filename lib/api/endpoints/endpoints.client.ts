"use client";
import { API } from "../api.client";
import { createEndpoints } from "./endpoints.factory";

export const { ApiUserProfile } = createEndpoints(API);
