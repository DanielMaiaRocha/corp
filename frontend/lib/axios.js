import axios from "axios";

const instance = axios.create({
  baseURL: "https://corp2.onrender.com/api",
  withCredentials: true, 
});

export default instance;
