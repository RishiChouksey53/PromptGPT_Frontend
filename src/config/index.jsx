import axios from "axios";

export const BASE_URL = "http://localhost:8080";
// export const BASE_URL = "https://promptgpt-backend.onrender.com";

export const clientServer = axios.create({
  baseURL: BASE_URL,
});
