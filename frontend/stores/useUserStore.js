import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

// Definição do estado da loja com Zustand
export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  // Método para registrar um novo usuário
  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });

    // Verificação de senhas coincidentes
    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }

    try {
      console.log("Sending signup request:", { name, email, password }); // Log para debug
      const res = await axios.post("/auth/signup", { name, email, password });
      console.log("Signup response:", res.data); // Log de resposta
      set({ user: res.data, loading: false });
      toast.success("Account created successfully!");
    } catch (error) {
      set({ loading: false });
      console.error("Signup error:", error.response?.data || error.message); // Log de erro
      toast.error(error.response?.data?.message || "An error occurred during signup");
    }
  },

  // Método de login
  login: async (email, password) => {
    set({ loading: true });

    try {
      console.log("Sending login request:", { email, password }); // Log para debug
      const res = await axios.post("/auth/login", { email, password });
      console.log("Login response:", res.data); // Log de resposta
      set({ user: res.data, loading: false });
      toast.success("Logged in successfully!");
    } catch (error) {
      set({ loading: false });
      console.error("Login error:", error.response?.data || error.message); // Log de erro
      toast.error(error.response?.data?.message || "An error occurred during login");
    }
  },

  // Método de logout
  logout: async () => {
    try {
      console.log("Sending logout request"); // Log para debug
      await axios.post("/auth/logout");
      set({ user: null });
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message); // Log de erro
      toast.error(error.response?.data?.message || "An error occurred during logout");
    }
  },

  // Método para verificar a autenticação do usuário
  checkAuth: async () => {
    set({ checkingAuth: true });

    try {
      console.log("Checking user authentication"); // Log para debug
      const response = await axios.get("/auth/profile");
      console.log("Auth check response:", response.data); // Log de resposta
      set({ user: response.data, checkingAuth: false });
    } catch (error) {
      console.error("Auth check error:", error.response?.data || error.message); // Log de erro
      set({ checkingAuth: false, user: null });
    }
  },

  // Método para renovar o token de autenticação
  refreshToken: async () => {
    if (get().checkingAuth) return;

    set({ checkingAuth: true });

    try {
      console.log("Refreshing token"); // Log para debug
      const response = await axios.post("/auth/refresh-token");
      console.log("Token refresh response:", response.data); // Log de resposta
      set({ checkingAuth: false });
      return response.data;
    } catch (error) {
      console.error("Token refresh error:", error.response?.data || error.message); // Log de erro
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },
}));

// Interceptor do Axios para lidar com erros e renovação de token
let refreshPromise = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Verifica se o erro foi 401 (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Se um token já estiver sendo renovado, aguarde
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }

        // Inicia o processo de renovação do token
        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        // Repete a requisição original com o novo token
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError.message); // Log de erro
        useUserStore.getState().logout(); // Desconecta o usuário em caso de falha
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);