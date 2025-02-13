import axios from "axios";

const axiosInstance = axios.create({
	baseURL: import.meta.mode === "development" ? "https://corp2.onrender.com/api" : "/api",
	withCredentials: true,
});

export default axiosInstance;