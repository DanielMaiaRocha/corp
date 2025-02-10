import { useEffect, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "../../stores/useCartStore";
import { Link } from "react-router-dom"; // Importe o Link

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
        <div className='py-12'>
            <div className='container mx-auto px-4'>
                <h2 className='text-center text-2xl sm:text-3xl font-bold font-leagueGothic text-black mb-4'>Destaques</h2>
                <div className='relative'>
                    <div className='overflow-hidden'>
                        <div
                            className='flex transition-transform duration-300 ease-in-out'
                            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
                        >
                            {featuredProducts?.map((product) => (
                                <div key={product._id} className='w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2'>
                                    <div className='bg-white bg-opacity-10 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden h-full transition-all duration-300 hover:shadow-xl'>
                                        {/* Link para a página do produto */}
                                        <Link to={`/product/${product._id}`} className="block">
                                            <div className='overflow-hidden'>
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className='w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-110'
                                                />
                                            </div>
                                            <div className='p-4'>
                                                <h3 className='text-lg font-semibold mb-2 text-black'>{product.name}</h3>
                                                <p className='text-black font-medium mb-4'>
                                                    ${product.price.toFixed(2)}
                                                </p>
                                            </div>
                                        </Link>
                                        {/* Botão "Add to Cart" fora do Link */}
                                        <div className='p-4 pt-0'>
                                            <button
                                                onClick={() => addToCart(product)}
                                                className='w-full bg-[#e40612] hover:bg-red-500 text-white font-semibold py-2 px-4 rounded transition-colors duration-300 
                                                flex items-center justify-center'
                                            >
                                                <ShoppingCart className='w-5 h-5 mr-2' />
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={prevSlide}
                        disabled={isStartDisabled}
                        className={`absolute top-1/2 -left-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${
                            isStartDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-[#e40612] hover:bg-red-500"
                        }`}
                    >
                        <ChevronLeft className='w-6 h-6' />
                    </button>

                    <button
                        onClick={nextSlide}
                        disabled={isEndDisabled}
                        className={`absolute top-1/2 -right-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${
                            isEndDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-[#e40612] hover:bg-red-500"
                        }`}
                    >
                        <ChevronRight className='w-6 h-6' />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeaturedProducts;