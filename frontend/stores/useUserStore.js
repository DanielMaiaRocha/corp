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
          const res = await axios.post("/auth/signup", {
            name,
            email,
            password,
          });
          set({ user: res.data, loading: false });
          toast.success("Account created successfully!");
        } catch (error) {
          set({ loading: false });
          toast.error(
            error.response?.data?.message || "An error occurred during signup"
          );
        }
      },

      fetchUsers: async () => {
        set({ loading: true });
        try {
            const response = await axios.get("/auth/");
            set({ users: response.data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
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
          toast.error(
            error.response?.data?.message || "An error occurred during login"
          );
        }
      },

      // Método de logout
      logout: async () => {
        try {
          await axios.post("/auth/logout");
          set({ user: null });
          toast.success("Logged out successfully!");
        } catch (error) {
          toast.error(
            error.response?.data?.message || "An error occurred during logout"
          );
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
          toast.error(
            error.response?.data?.message ||
              "An error occurred while updating profile"
          );
        }
      },

      registerCorpForm: async (formData, updateUser) => {
        try {
          const res = await axios.put("/drops/cadastroDrops", formData);

          // Atualiza o estado do usuário na store, se necessário
          if (updateUser) {
            updateUser(res.data.user);
          }

          toast.success("Formulário cadastrado com sucesso!");
          return res.data;
        } catch (error) {
          toast.error(
            error.response?.data?.message || "Erro ao cadastrar formulário"
          );
          throw error;
        }
      },
      fetchCorpForm: async () => {
        set({ loading: true });

        try {
          const res = await axios.get("/drops/cadastroDrops"); // Rota para buscar o formulário pelo usuário logado
          set({ corpForm: res.data.form, loading: false });
          return res.data.form;
        } catch (error) {
          set({ loading: false });
          toast.error(
            error.response?.data?.message || "Erro ao buscar formulário"
          );
          throw error;
        }
      },
      // Método para verificar a autenticação do usuário (chamado apenas na inicialização do app)
      checkAuth: async () => {
        set({ checkingAuth: true });

        try {
          const response = await axios.get("/auth/profile");
          set({ user: response.data, checkingAuth: false });
        } catch (error) {
          set({ checkingAuth: false, user: null });
        }
      },

      // Método para renovar o token de autenticação (só é chamado quando necessário)
      refreshToken: async () => {
        if (get().checkingAuth) return; // Evita chamadas duplicadas

        set({ checkingAuth: true });

        try {
          const response = await axios.post("/auth/refresh-token", {
            refreshToken: get().user?.refreshToken, // Envia o refreshToken corretamente
          });

          set({
            user: { ...get().user, accessToken: response.data.accessToken },
            checkingAuth: false,
          });

          return response.data;
        } catch (error) {
          console.error(
            "Erro ao renovar o token:",
            error.response?.data || error.message
          );
          set({ user: null, checkingAuth: false });
          throw error;
        }
      },
    }),
    {
      name: "user-store",
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

        console.log("Repetindo requisição original após refresh do token...");
        return axios(originalRequest); // Refaz a requisição original após o refresh do token
      } catch (refreshError) {
        console.error("Falha ao renovar o token, deslogando o usuário...");
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
