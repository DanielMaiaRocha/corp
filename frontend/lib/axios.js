import axios from "axios";

const instance = axios.create({
  baseURL: "https://corp.railway.internal/api",
  withCredentials: true, 
});

export default instance;
