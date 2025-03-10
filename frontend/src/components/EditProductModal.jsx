import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useProductStore } from "../../stores/useProductStore";
import { X, Upload, Loader } from "lucide-react";
import imageCompression from "browser-image-compression";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const categories = ["Blusas", "Regatas", "Calças", "Bones", "Jaquetas", "Casacos"];
const sizes = ["PP", "P", "M", "G", "GG"];

const EditProductModal = ({ product, onClose, onUpdate }) => {
    const [editedProduct, setEditedProduct] = useState(product);
    const [fileInfo, setFileInfo] = useState([]); // Armazena informações dos arquivos
    const [error, setError] = useState("");
    const { updateProduct, loading } = useProductStore();

    // Fechar o modal ao pressionar ESC
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        // Adiciona o listener para o evento keydown
        window.addEventListener("keydown", handleKeyDown);

        // Remove o listener quando o componente é desmontado
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    useEffect(() => {
        setEditedProduct(product);
        // Preenche fileInfo com as imagens existentes do produto
        if (product.mainImage && product.images) {
            const images = [product.mainImage, ...product.images];
            setFileInfo(
                images.map((img, index) => ({
                    name: `Imagem ${index + 1}`,
                    size: "0 KB", // Tamanho não disponível para imagens já salvas
                    base64: img,
                }))
            );
        }
    }, [product]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editedProduct.size.length === 0) {
            setError("Selecione pelo menos um tamanho.");
            return;
        }

        if (!editedProduct.mainImage || editedProduct.images.length === 0) {
            setError("Selecione pelo menos uma imagem principal e uma imagem adicional.");
            return;
        }

        try {
            await updateProduct(product._id, editedProduct);
            onUpdate(); // Atualiza a lista de produtos após a edição
            onClose(); // Fecha o modal
        } catch {
            console.log("error updating the product");
            setError("Erro ao atualizar o produto. Tente novamente.");
        }
    };

    const handleImageChange = async (e) => {
        const files = e.target.files; // Pega todos os arquivos selecionados
        if (files.length > 0) {
            const maxSize = 5 * 1024 * 1024; // 5MB
            const validFiles = [];
            const invalidFiles = [];

            // Verifica e comprime cada arquivo
            for (let i = 0; i < files.length; i++) {
                if (files[i].size > maxSize) {
                    invalidFiles.push(files[i].name);
                } else {
                    try {
                        // Comprime a imagem
                        const compressedFile = await imageCompression(files[i], {
                            maxSizeMB: 1, // Tamanho máximo da imagem após compressão (1MB)
                            maxWidthOrHeight: 1024, // Dimensão máxima da imagem
                            useWebWorker: true, // Usa um Web Worker para melhorar o desempenho
                        });
                        validFiles.push(compressedFile);
                    } catch (error) {
                        console.error("Erro ao comprimir a imagem:", error);
                        setError("Erro ao processar as imagens. Tente novamente.");
                        return;
                    }
                }
            }

            if (invalidFiles.length > 0) {
                setError(`Algumas imagens excedem o tamanho máximo de 5MB: ${invalidFiles.join(", ")}`);
                return;
            }

            // Converte os arquivos válidos para base64
            const readers = validFiles.map((file) => {
                const reader = new FileReader();
                return new Promise((resolve) => {
                    reader.onloadend = () => {
                        resolve({
                            name: file.name,
                            size: (file.size / 1024).toFixed(2) + " KB",
                            base64: reader.result, // Imagem em base64
                        });
                    };
                    reader.readAsDataURL(file);
                });
            });

            // Adiciona as imagens ao estado
            Promise.all(readers).then((results) => {
                const allImages = results.map((result) => result.base64); // Todas as imagens
                const mainImage = allImages[0]; // Primeira imagem é a principal
                const additionalImages = allImages.slice(1); // Demais imagens

                setEditedProduct((prevState) => ({
                    ...prevState,
                    mainImage, // Define a imagem principal
                    images: additionalImages, // Define as imagens adicionais
                }));
                setFileInfo((prevState) => [...prevState, ...results]);
                setError("");
            });
        }
    };

    const handleSizeChange = (size) => {
        setEditedProduct((prevState) => {
            if (prevState.size.includes(size)) {
                return { ...prevState, size: prevState.size.filter((s) => s !== size) };
            } else {
                return { ...prevState, size: [...prevState.size, size] };
            }
        });
    };

    const handleRemoveImage = (index) => {
        setEditedProduct((prevState) => ({
            ...prevState,
            images: prevState.images.filter((_, i) => i !== index),
        }));
        setFileInfo((prevState) => prevState.filter((_, i) => i !== index));
    };

    // Função para reordenar as imagens
    const handleDragEnd = (result) => {
        if (!result.destination) return; // Se o item não foi solto em um destino válido

        const items = Array.from(fileInfo);
        const [reorderedItem] = items.splice(result.source.index, 1); // Remove o item da posição original
        items.splice(result.destination.index, 0, reorderedItem); // Insere o item na nova posição

        // Atualiza o estado das imagens
        setFileInfo(items);

        // Define a primeira imagem como a imagem principal
        const mainImage = items[0].base64;
        const additionalImages = items.slice(1).map((item) => item.base64);

        setEditedProduct((prevState) => ({
            ...prevState,
            mainImage,
            images: additionalImages,
        }));
    };

    return (
        <motion.div
    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[9999]" // z-[9999] para garantir que fique acima de tudo
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose} // Fecha o modal ao clicar fora
>
    <motion.div
        className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[70vh] overflow-y-auto relative" // max-w-md e max-h-[90vh] com overflow-y-auto
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        onClick={(e) => e.stopPropagation()} // Impede que o clique dentro do modal feche-o
    >
        <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
            <X className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-semibold mb-6">Editar Produto</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input para o nome do produto */}
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

            {/* Input para a descrição do produto */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Descrição
                </label>
                <textarea
                    id="description"
                    value={editedProduct.description}
                    onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                    rows="3"
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 resize-none"
                    required
                />
            </div>

            {/* Input para o preço do produto */}
            <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Preço
                </label>
                <input
                    type="number"
                    id="price"
                    value={editedProduct.price}
                    onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value })}
                    step="0.01"
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    required
                />
            </div>

            {/* Select para a categoria do produto */}
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Categoria
                </label>
                <select
                    id="category"
                    value={editedProduct.category}
                    onChange={(e) => setEditedProduct({ ...editedProduct, category: e.target.value })}
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    required
                >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            {/* Input para a quantidade em estoque */}
            <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                    Quantidade em estoque
                </label>
                <input
                    type="number"
                    id="quantity"
                    value={editedProduct.quantity}
                    onChange={(e) => setEditedProduct({ ...editedProduct, quantity: e.target.value })}
                    min="1"
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    required
                />
            </div>

            {/* Input para os tamanhos disponíveis */}
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Tamanhos disponíveis
                </label>
                <div className="flex space-x-2 mt-1">
                    {sizes.map((size) => (
                        <label key={size} className="flex items-center space-x-1">
                            <input
                                type="checkbox"
                                checked={editedProduct.size.includes(size)}
                                onChange={() => handleSizeChange(size)}
                                className="form-checkbox h-4 w-4 text-red-600 rounded focus:ring-red-500"
                            />
                            <span>{size}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Input para upload de múltiplas imagens */}
            <div className="mt-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagens do Produto
                </label>
                <input
                    type="file"
                    id="images"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleImageChange}
                    multiple // Permite seleção de múltiplos arquivos
                />
                <label
                    htmlFor="images"
                    className="cursor-pointer bg-red-600 py-2 px-3 rounded-md shadow-sm text-base leading-4 font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    <Upload className="h-5 w-5 inline-block mr-2" />
                    Upload de Imagens
                </label>
                {fileInfo.length > 0 && (
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="images">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="mt-3 space-y-2"
                                >
                                    {fileInfo.map((file, index) => (
                                        <Draggable key={index} draggableId={index.toString()} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <img
                                                            src={file.base64}
                                                            alt={file.name}
                                                            className="w-10 h-10 object-cover rounded"
                                                        />
                                                        <div>
                                                            <p className="text-sm text-gray-700">{file.name}</p>
                                                            <p className="text-xs text-gray-500">{file.size}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(index)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        Remover
                                                    </button>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                )}
            </div>

            {/* Botão de submit */}
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