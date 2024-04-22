import axios from "axios";
import { getStoredSessionAndToken } from "./utils";

const url = `${process.env.NEXT_PUBLIC_BASE_URL}`;

export const Axios = axios.create({
  baseURL: url,
});

Axios.interceptors.request.use(
  (config) => {
    const storedData = getStoredSessionAndToken();
    console.log("storedData :", storedData);
    config.headers.Authorization = `Bearer ${storedData?.accessToken}`;
    config.headers["session-id"] = storedData?.sessionId;
    return config;
  },
  (error) => Promise.reject(error)
);
