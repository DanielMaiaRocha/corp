import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

// Função utilitária para lidar com requisições e atualizar o estado
const handleRequest = async (requestFn, set, successCallback, errorMessage) => {
	set({ loading: true });
	try {
		const response = await requestFn();
		successCallback(response.data);
		set({ loading: false });
	} catch (error) {
		set({ loading: false });
		toast.error(error.response?.data?.error || errorMessage);
	}
};

export const useProductStore = create((set) => ({
	products: [],
	loading: false,
	error: null,

	// Define os produtos diretamente no estado
	setProducts: (products) => set({ products }),

	// Cria um novo produto
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

	// Busca todos os produtos
	fetchAllProducts: async () => {
		await handleRequest(
			() => axios.get("/products"),
			set,
			(data) => set({ products: data.products }),
			"Failed to fetch products"
		);
	},

	// Busca produtos por categoria
	fetchProductsByCategory: async (category) => {
		await handleRequest(
			() => axios.get(`/products/category/${category}`),
			set,
			(data) => set({ products: data.products }),
			"Failed to fetch products by category"
		);
	},

	// Deleta um produto
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

	// Alterna o status de "destaque" de um produto
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

	// Busca produtos em destaque
	fetchFeaturedProducts: async () => {
		await handleRequest(
			() => axios.get("/products/featured"),
			set,
			(data) => set({ products: data }),
			"Failed to fetch featured products"
		);
	},
}));