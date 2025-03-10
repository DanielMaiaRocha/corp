import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useProductStore } from "../../stores/useProductStore";
import { X } from "lucide-react";

const EditProductModal = ({ product, onClose, onUpdate }) => {
    const [editedProduct, setEditedProduct] = useState(product);
    const { updateProduct, loading } = useProductStore();

    useEffect(() => {
        setEditedProduct(product);
    }, [product]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateProduct(product._id, editedProduct);
        onUpdate(); // Atualiza a lista de produtos após a edição
        onClose(); // Fecha o modal
    };

    return (
        <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white rounded-lg p-6 w-full max-w-2xl relative"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <X className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-semibold mb-6">Editar Produto</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Campos do formulário (reutilize o mesmo do CreateProductForm) */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Nome do Produto
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={editedProduct.name}
                            onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                            className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                            required
                        />
                    </div>
                    {/* Adicione os outros campos aqui (description, price, category, etc.) */}
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Salvando..." : "Salvar Alterações"}
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default EditProductModal;