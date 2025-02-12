import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
    cart: [],
    coupon: null,
    total: 0,
    subtotal: 0,
    isCouponApplied: false,

    // Busca o cupom do usuário
    getMyCoupon: async () => {
        try {
            const response = await axios.get("/coupons");
            set({ coupon: response.data });
        } catch (error) {
            console.error("Error fetching coupon:", error);
        }
    },

    // Aplica um cupom
    applyCoupon: async (code) => {
        try {
            const response = await axios.post("/coupons/validate", { code });
            set({ coupon: response.data, isCouponApplied: true });
            get().calculateTotals(); // Recalcula os totais
            toast.success("Coupon applied successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to apply coupon");
        }
    },

    // Remove o cupom
    removeCoupon: () => {
        set({ coupon: null, isCouponApplied: false });
        get().calculateTotals(); // Recalcula os totais
        toast.success("Coupon removed");
    },

    // Busca os itens do carrinho
    getCartItems: async () => {
        try {
            const res = await axios.get("/cart");
            set({ cart: res.data });
            get().calculateTotals(); // Recalcula os totais
        } catch (error) {
            set({ cart: [] });
            toast.error(error.response.data.message || "An error occurred");
        }
    },

    // Limpa o carrinho
    clearCart: async () => {
        set({ cart: [], coupon: null, total: 0, subtotal: 0 });
    },

    // Adiciona um produto ao carrinho
    addToCart: async (product) => {
        try {
            await axios.post("/cart", { productId: product._id });
            toast.success("Product added to cart");

            set((prevState) => {
                const existingItem = prevState.cart.find((item) => item._id === product._id);

                // Se o produto já existe no carrinho, aumenta a quantidade
                if (existingItem) {
                    const updatedCart = prevState.cart.map((item) =>
                        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                    );
                    return { cart: updatedCart };
                }

                // Se o produto não existe, adiciona ao carrinho com quantidade 1
                return { cart: [...prevState.cart, { ...product, quantity: 1 }] };
            });

            get().calculateTotals(); // Recalcula os totais
        } catch (error) {
            toast.error(error.response.data.message || "An error occurred");
        }
    },

    // Remove um produto do carrinho
    removeFromCart: async (productId) => {
        try {
            await axios.delete("/cart", { data: { productId } });
            set((prevState) => ({ cart: prevState.cart.filter((item) => item._id !== productId) }));
            get().calculateTotals(); // Recalcula os totais
        } catch (error) {
            toast.error(error.response.data.message || "An error occurred");
        }
    },

    // Atualiza a quantidade de um produto no carrinho
	updateQuantity: async (productId, quantity) => {
		if (quantity <= 0) {
			get().removeFromCart(productId);
			return;
		}
	
		try {
			// Atualiza no backend
			const res = await axios.put(`/cart/${productId}`, { quantity });
	
			if (res.status === 200) {
				// Atualiza o estado do carrinho no frontend
				set((prevState) => ({
					cart: prevState.cart.map((item) =>
						item._id === productId ? { ...item, quantity } : item
					),
				}));
	
				// Recalcula os totais
				get().calculateTotals();
	
				toast.success("Quantidade atualizada!");
			} else {
				throw new Error("Falha ao atualizar a quantidade.");
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Erro ao atualizar a quantidade.");
		}
	},

    // Calcula os totais (subtotal e total)
    calculateTotals: () => {
        const { cart, coupon } = get();

        // Calcula o subtotal (soma de todos os itens no carrinho)
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Calcula o total aplicando o desconto do cupom (se houver)
        let total = subtotal;
        if (coupon && get().isCouponApplied) {
            const discount = subtotal * (coupon.discountPercentage / 100);
            total = subtotal - discount;
        }

        // Atualiza os totais no estado
        set({ subtotal, total });
    },
}));