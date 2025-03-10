import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

const handleRequest = async (requestFn, set, successCallback, errorMessage) => {
    set({ loading: true });
    try {
        const response = await requestFn();
        successCallback(response.data);
        set({ loading: false });
    } catch (error) {
        set({ loading: false });
        if (error.response) {
            toast.error(error.response.data.error || errorMessage);
        } else if (error.request) {
            toast.error("Network error. Please check your connection.");
        } else {
            toast.error("An unexpected error occurred.");
        }
    }
};

export const useProductStore = create((set) => ({
    products: [],
    loading: false,
    error: null,

    setProducts: (products) => set({ products }),

    // Método atualizado para buscar todos os produtos pela nova rota pública
    fetchAllProducts: async () => {
        await handleRequest(
            () => axios.get("/products"), 
            set, 
            (data) => set({ products: data.products }), 
            "Failed to fetch products"
        );
    },

    fetchProductsByCategory: async (category) => {
        await handleRequest(
            () => axios.get(`/products/category/${category}`),
            set,
            (data) => set({ products: data.products }),
            "Failed to fetch products by category"
        );
    },

    createProduct: async (productData) => {
        await handleRequest(
            () => axios.post("/products", productData),
            set,
            (newProduct) => {
                set((prevState) => ({
                    products: [...prevState.products, newProduct],
                }));
                toast.success("Product created successfully!");
            },
            "Failed to create product"
        );
    },

    deleteProduct: async (productId) => {
        await handleRequest(
            () => axios.delete(`/products/${productId}`),
            set,
            () => {
                set((prevState) => ({
                    products: prevState.products.filter((product) => product._id !== productId),
                }));
                toast.success("Product deleted successfully!");
            },
            "Failed to delete product"
        );
    },

    toggleFeaturedProduct: async (productId) => {
        await handleRequest(
            () => axios.patch(`/products/${productId}`),
            set,
            (updatedProduct) => {
                set((prevState) => ({
                    products: prevState.products.map((product) =>
                        product._id === productId ? { ...product, isFeatured: updatedProduct.isFeatured } : product
                    ),
                }));
                toast.success("Product updated successfully!");
            },
            "Failed to update product"
        );
    },

    fetchFeaturedProducts: async () => {
        await handleRequest(
            () => axios.get("/products/featured"),
            set,
            (data) => set({ products: data }),
            "Failed to fetch featured products"
        );
    },

    updateProduct: async (productId, updatedData) => {
        await handleRequest(
            () => axios.put(`/products/${productId}`, updatedData),
            set,
            (updatedProduct) => {
                set((prevState) => ({
                    products: prevState.products.map((product) =>
                        product._id === productId ? { ...product, ...updatedProduct } : product
                    ),
                }));
                toast.success("Product updated successfully!");
            },
            "Failed to update product"
        );
    },
}));
