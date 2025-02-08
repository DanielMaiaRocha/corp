import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../../stores/useUserStore";
import { useCartStore } from "../../stores/useCartStore";

const ProductCard = ({ product }) => {
	const { user } = useUserStore();
	const { addToCart } = useCartStore();
	const navigate = useNavigate();

	const handleAddToCart = (e) => {
		e.stopPropagation(); // Previne que o clique no botão redirecione para a página do produto
		if (!user) {
			toast.error("Please login to add products to cart", { id: "login" });
			return;
		} else {
			addToCart(product);
			toast.success(`${product.name} added to cart!`);
		}
	};

	const handleNavigateToProduct = () => {
		navigate(`/product/${product._id}`); // Redireciona para a página do produto com base no ID
	};

	return (
		<div
			className="flex w-full relative flex-col overflow-hidden rounded-lg border cursor-pointer"
			onClick={handleNavigateToProduct}
		>
			<div className="relative flex h-60 overflow-hidden rounded-t-lg">
				<img
					className="object-cover w-full h-80"
					src={product.image}
					alt="product image"
				/>
				<div className="absolute inset-0 bg-black bg-opacity-20" />
			</div>

			<div className="mt-4 px-5 pb-5 flex flex-row justify-between items-center">
				<div>
					<h5 className="text-xl font-semibold tracking-tight text-gray-700">
						{product.name}
					</h5>
					<p className="text-xl font-bold text-gray-700">${product.price}</p>
				</div>
				<button
					className="flex items-center justify-center rounded-lg bg-emerald-600 px-3 py-2 text-center text-sm font-medium
					 text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
					onClick={handleAddToCart}
				>
					<ShoppingCart size={20} />
				</button>
			</div>
		</div>
	);
};

export default ProductCard;
