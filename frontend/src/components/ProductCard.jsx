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
            className="flex flex-col bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
            onClick={handleNavigateToProduct}
        >
            {/* Contêiner da Imagem */}
            <div className="relative aspect-square overflow-hidden rounded-t-lg">
                <img
                    className="object-cover w-full h-full" // Garante que a imagem cubra o espaço disponível
                    src={product.mainImage}
                    alt={product.name}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity duration-200" />
            </div>

            {/* Detalhes do Produto */}
            <div className="p-4">
                <h5 className="text-sm font-medium text-gray-800 mb-1">
                    {product.name}
                </h5>
                <p className="text-xs text-gray-500 mb-2">
                    {product.category}
                </p>
                <p className="text-sm font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                </p>
            </div>

            {/* Botão de Adicionar ao Carrinho */}
            <div className="p-4 border-t border-gray-100">
                <button
                    className="w-full flex items-center justify-center rounded-lg bg-[#e40612] px-3 py-2 text-center text-sm font-medium
                     text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition-colors duration-200"
                    onClick={handleAddToCart}
                >
                    <ShoppingCart size={16} className="mr-2" />
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;