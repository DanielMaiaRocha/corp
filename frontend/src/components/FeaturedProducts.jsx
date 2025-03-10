import { useEffect, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "../../stores/useCartStore";
import { Link } from "react-router-dom";

const FeaturedProducts = ({ featuredProducts }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(4);

    const { addToCart } = useCartStore();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setItemsPerPage(1);
            else if (window.innerWidth < 1024) setItemsPerPage(2);
            else if (window.innerWidth < 1280) setItemsPerPage(3);
            else setItemsPerPage(4);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
    };

    const isStartDisabled = currentIndex === 0;
    const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage;

    return (
        <div className="py-20">
            <div className="container mx-auto px-4">
                <h2 className="text-center text-2xl sm:text-3xl font-bold font-leagueGothic text-black mb-8">
                    Destaques
                </h2>
                <div className="relative">
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-300 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
                        >
                            {featuredProducts?.map((product) => (
                                <div key={product._id} className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2">
                                    <div className="flex flex-col bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
                                        {/* Link para a página do produto */}
                                        <Link to={`/product/${product._id}`} className="block">
                                            {/* Imagem do Produto */}
                                            <div className="relative aspect-square overflow-hidden rounded-t-lg">
                                                <img
                                                    className="object-cover w-full h-full"
                                                    src={product.mainImage}
                                                    alt={product.name}
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity duration-200" />
                                            </div>

                                            {/* Detalhes do Produto */}
                                            <div className="p-4">
                                                <h3 className="text-sm font-medium text-gray-800 mb-1">
                                                    {product.name}
                                                </h3>
                                                <p className="text-xs text-gray-500 mb-2">
                                                    {product.category}
                                                </p>
                                                <p className="text-sm font-bold text-gray-900">
                                                    ${product.price.toFixed(2)}
                                                </p>
                                            </div>
                                        </Link>

                                        {/* Botão de Adicionar ao Carrinho */}
                                        <div className="p-4 border-t border-gray-100">
                                            <button
                                                onClick={() => addToCart(product)}
                                                className="w-full flex items-center justify-center rounded-lg bg-[#e40612] px-3 py-2 text-center text-sm font-medium
                                                 text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition-colors duration-200"
                                            >
                                                <ShoppingCart size={16} className="mr-2" />
                                                Adicionar ao Carrinho
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Botões de Navegação */}
                    <button
                        onClick={prevSlide}
                        disabled={isStartDisabled}
                        className={`absolute top-1/2 -left-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${
                            isStartDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-[#e40612] hover:bg-red-500"
                        }`}
                    >
                        <ChevronLeft className="w-6 h-6 text-white" />
                    </button>

                    <button
                        onClick={nextSlide}
                        disabled={isEndDisabled}
                        className={`absolute top-1/2 -right-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${
                            isEndDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-[#e40612] hover:bg-red-500"
                        }`}
                    >
                        <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeaturedProducts;