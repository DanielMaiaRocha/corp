import { motion } from "framer-motion";
import { Trash, Star, Edit, ChevronDown, ChevronUp } from "lucide-react";
import { useProductStore } from "../../stores/useProductStore";
import { useState } from "react";
import EditProductModal from "./EditProductModal";

const ProductsList = () => {
    const { deleteProduct, toggleFeaturedProduct, products } = useProductStore();
    const [editingProduct, setEditingProduct] = useState(null);
    const [expandedProductId, setExpandedProductId] = useState(null); // Estado para controlar o produto expandido

    const handleEdit = (product) => {
        setEditingProduct(product);
    };

    const handleUpdate = () => {
        setEditingProduct(null);
    };

    const toggleExpand = (productId) => {
        setExpandedProductId((prevId) => (prevId === productId ? null : productId));
    };

    return (
        <>
            <motion.div
                className="bg-gray-200 shadow-xl rounded-lg overflow-hidden max-w-4xl mx-auto p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="hidden md:grid grid-cols-5 gap-4 text-sm font-medium text-gray-300 uppercase bg-gray-700 p-4 rounded-lg">
                    <div>Product (Stock)</div>
                    <div>Price</div>
                    <div>Category</div>
                    <div>Featured</div>
                    <div>Actions</div>
                </div>
                <div className="space-y-4">
                    {products?.map((product) => (
                        <motion.div
                            key={product._id}
                            className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="md:hidden flex justify-between items-center">
                                <div className="flex items-center">
                                    <img
                                        className="h-10 w-10 rounded-full object-cover"
                                        src={product.mainImage}
                                        alt={product.name}
                                    />
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-black">
                                            {product.name} - ({product.quantity} em estoque)
                                        </div>
                                        <div className="text-sm text-gray-700">${product.price.toFixed(2)}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleExpand(product._id)}
                                    className="text-gray-700 hover:text-gray-900 transition-colors duration-200"
                                >
                                    {expandedProductId === product._id ? (
                                        <ChevronUp className="h-5 w-5" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {expandedProductId === product._id && (
                                <div className="md:hidden mt-4 space-y-2">
                                    <div className="text-sm text-gray-700">
                                        <span className="font-medium">Categoria:</span> {product.category}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-gray-700">Destaque:</span>
                                        <button
                                            onClick={() => toggleFeaturedProduct(product._id)}
                                            className={`p-1 rounded-full ${
                                                product.isFeatured ? "bg-yellow-400 text-gray-900" : "bg-gray-300 text-gray-700"
                                            } hover:bg-yellow-500 transition-colors duration-200`}
                                        >
                                            <Star className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                        >
                                            <Edit className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => deleteProduct(product._id)}
                                            className="text-red-400 hover:text-red-300 transition-colors duration-200"
                                        >
                                            <Trash className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div className="hidden md:grid md:grid-cols-5 gap-4 items-center">
                                <div className="flex items-center">
                                    <img
                                        className="h-10 w-10 rounded-full object-cover"
                                        src={product.mainImage}
                                        alt={product.name}
                                    />
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-black">
                                            {product.name} - ({product.quantity} em estoque)
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-700">${product.price.toFixed(2)}</div>
                                <div className="text-sm text-gray-700">{product.category}</div>
                                <div className="flex justify-center">
                                    <button
                                        onClick={() => toggleFeaturedProduct(product._id)}
                                        className={`p-1 rounded-full ${
                                            product.isFeatured ? "bg-yellow-400 text-gray-900" : "bg-gray-300 text-gray-700"
                                        } hover:bg-yellow-500 transition-colors duration-200`}
                                    >
                                        <Star className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="flex space-x-2 justify-end">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                    >
                                        <Edit className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => deleteProduct(product._id)}
                                        className="text-red-400 hover:text-red-300 transition-colors duration-200"
                                    >
                                        <Trash className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Modal de Edição */}
            {editingProduct && (
                <EditProductModal
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                    onUpdate={handleUpdate}
                />
            )}
        </>
    );
};

export default ProductsList;