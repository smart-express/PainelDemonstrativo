import axios from "axios";
import { getSession } from "../auth/auth.service";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://painelpromotorexpress.147.15.13.77.nip.io";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const session = getSession();

  if (session) {
    config.headers.Authorization = `${session.tokenType} ${session.accessToken}`;
  }

  return config;
});

