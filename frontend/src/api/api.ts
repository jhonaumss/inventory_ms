import axios from "axios";
import type { AxiosInstance } from "axios";

let api: AxiosInstance | null = null;

export const getApi = (): AxiosInstance => {
  if (!api) {
    api = axios.create({
      baseURL: "http://localhost:8080/api",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  return api;
};
