import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

// Criando o estado global com persistência no localStorage
export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      checkingAuth: true,

      // Método para registrar um novo usuário
      signup: async ({ name, email, password, confirmPassword }) => {
        set({ loading: true });

        if (password !== confirmPassword) {
          set({ loading: false });
          return toast.error("Passwords do not match");
        }

        try {
          const res = await axios.post("/auth/signup", { name, email, password });
          set({ user: res.data, loading: false });
          toast.success("Account created successfully!");
        } catch (error) {
          set({ loading: false });
          toast.error(error.response?.data?.message || "An error occurred during signup");
        }
      },

      // Método para buscar o perfil do usuário
      getProfile: async () => {
        set({ loading: true });

        try {
          const response = await axios.get("/auth/profile");
          set({ user: response.data, loading: false });
        } catch (error) {
          set({ loading: false });
          toast.error("Failed to load profile");
        }
      },

      // Método para atualizar o perfil do usuário
      updateProfile: async (formData) => {
        set({ loading: true });

        try {
          const res = await axios.put("/auth/profile", formData);
          set({ user: res.data, loading: false });
          toast.success("Profile updated successfully!");
        } catch (error) {
          set({ loading: false });
          toast.error(error.response?.data?.message || "An error occurred while updating profile");
        }
      },

      // Método de login
      login: async (email, password) => {
        set({ loading: true });

        try {
          const res = await axios.post("/auth/login", { email, password });
          set({ user: res.data, loading: false });
          toast.success("Logged in successfully!");
        } catch (error) {
          set({ loading: false });
          toast.error(error.response?.data?.message || "An error occurred during login");
        }
      },

      // Método de logout
      logout: async () => {
        try {
          await axios.post("/auth/logout");
          set({ user: null });
          toast.success("Logged out successfully!");
        } catch (error) {
          toast.error(error.response?.data?.message || "An error occurred during logout");
        }
      },

      // Método para verificar a autenticação do usuário
      checkAuth: async () => {
        set({ checkingAuth: true });

        try {
          const response = await axios.get("/auth/profile");
          set({ user: response.data, checkingAuth: false });
        } catch (error) {
          set({ checkingAuth: false, user: null });
        }
      },

      // Método para renovar o token de autenticação
      refreshToken: async () => {
        if (get().checkingAuth) return;

        set({ checkingAuth: true });

        try {
          const response = await axios.post("/auth/refresh-token");
          set({ checkingAuth: false });
          return response.data;
        } catch (error) {
          set({ user: null, checkingAuth: false });
          throw error;
        }
      },
    }),
    {
      name: "user-store", // Persistindo no localStorage
      getStorage: () => localStorage,
    }
  )
);

// Interceptor do Axios para lidar com erros e renovação de token
let refreshPromise = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = useUserStore.getState().refreshToken();
          await refreshPromise;
          refreshPromise = null;
        } else {
          await refreshPromise;
        }

        return axios(originalRequest);
      } catch (refreshError) {
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
