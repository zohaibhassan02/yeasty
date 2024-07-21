// /lib/api.js
import axios from 'axios';
import { BaseUrl } from "../constants/Constants"

const api = axios.create({
  baseURL: "https://final-yeasty.vercel.app", // This should be set in your .env file
  withCredentials: true, // Include this if you are using cookies for authentication
});

export default api;
