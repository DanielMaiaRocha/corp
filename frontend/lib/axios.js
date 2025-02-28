import axios from "axios";

const instance = axios.create({
  baseURL: "https://corp2.onrender.com",
  withCredentials: true, 
});

export default instance;
