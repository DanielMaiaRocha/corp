import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useProductStore } from "../../stores/useProductStore";
import { useEffect, useState } from "react";
import { useUserStore } from "../../stores/useUserStore";
import { useCartStore } from "../../stores/useCartStore";

const ProductPage = () => {
    const { id } = useParams(); // Obtém o ID do produto da URL
    const { products, fetchAllProducts } = useProductStore();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null); // Estado para o tamanho selecionado

    const { user } = useUserStore(); // Obtém o usuário do store
    const { addToCart } = useCartStore(); // Obtém a função addToCart do store

    useEffect(() => {
        // Busca todos os produtos se ainda não foram carregados
        if (!products.length) {
            fetchAllProducts();
        }
    }, [fetchAllProducts, products]);

    useEffect(() => {
        // Encontra o produto pelo ID
        if (products.length) {
            const foundProduct = products.find((p) => p._id === id);
            if (foundProduct) {
                setProduct(foundProduct);
                // Verifica se há imagens antes de definir a imagem selecionada
                if (foundProduct.images && foundProduct.images.length > 0) {
                    setSelectedImage(foundProduct.images[0]);
                }
            }
        }
    }, [id, products]);

    const handleAddToCart = () => {
        if (!user) {
            toast.error("Por favor, faça login para adicionar produtos ao carrinho.", { id: "login" });
            return;
        } else if (!selectedSize) {
            toast.error("Por favor, selecione um tamanho.", { id: "size" });
            return;
        } else {
            // Adiciona o produto ao carrinho com o tamanho selecionado
            addToCart({ ...product, selectedSize });
            toast.success("Produto adicionado ao carrinho!", { id: "addToCart" });
        }
    };

    if (!product) {
        return <p className="text-center text-lg mt-10">Produto não encontrado!</p>;
    }

    return (
        <div className="max-w-6xl mx-auto p-6 mb-20">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Coluna de imagens */}
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Miniaturas das imagens */}
                    <div className="flex flex-row md:flex-col gap-2">
                        {product.images && product.images.map((images, index) => (
                            <img
                                key={index}
                                src={images}
                                alt={`product-${index}`}
                                className={`w-20 h-20 object-cover rounded-md cursor-pointer border ${
                                    selectedImage === images ? "border-red-500" : "border-gray-300"
                                }`}
                                onClick={() => setSelectedImage(images)}
                            />
                        ))}
                    </div>

                    {/* Imagem principal */}
                    {selectedImage && (
                        <img
                            src={selectedImage}
                            alt={product.name}
                            className="w-full md:w-96 h-auto rounded-lg object-cover"
                        />
                    )}
                </div>

                {/* Detalhes do produto */}
                <div className="flex-1 space-y-4 border border-gray-400 h-72 p-4">
                    <h1 className="text-3xl font-bold">{product.name}</h1>
                    <p className="text-2xl font-semibold text-red-500">
                        R$ {product.price}
                    </p>
                    <p className="text-sm text-gray-500">{product.description}</p>

                    {/* Seletor de tamanho */}
                    {product.size && product.size.length > 0 && (
                        <div className="flex items-center space-x-4">
                            <span className="font-medium">Tamanho:</span>
                            <div className="flex space-x-2">
                                {product.size.map((size, index) => (
                                    <button
                                        key={index}
                                        className={`px-3 py-1 rounded-md border text-sm font-medium ${
                                            selectedSize === size
                                                ? "bg-red-600 text-white border-red-600"
                                                : "bg-white border-gray-300 hover:bg-gray-100"
                                        }`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Botões de ação */}
                    <div className="flex space-x-4">
                        <button
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            onClick={handleAddToCart}
                        >
                            Adicionar ao carrinho
                        </button>
                        <button className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900">
                            Finalizar compra
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;