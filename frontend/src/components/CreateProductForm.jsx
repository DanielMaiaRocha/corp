import React, { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useProductStore } from "../../stores/useProductStore";
import imageCompression from "browser-image-compression";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const categories = ["Blusas", "Regatas", "Calças", "Bones", "Jaquetas", "Casacos"];
const sizes = ["PP", "P", "M", "G", "GG"];

const CreateProductForm = () => {
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        mainImage: "",
        images: [],
        size: [],
        quantity: 0,
    });

    const [fileInfo, setFileInfo] = useState([]);
    const { createProduct, loading } = useProductStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createProduct(newProduct);
        setNewProduct({ name: "", description: "", price: "", category: "", mainImage: "", images: [], size: [], quantity: 0 });
        setFileInfo([]);
    };

    const handleImageChange = async (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            const maxSize = 5 * 1024 * 1024; // 5MB
            const validFiles = [];
            const invalidFiles = [];

            for (let i = 0; i < files.length; i++) {
                if (files[i].size > maxSize) {
                    invalidFiles.push(files[i].name);
                } else {
                    try {
                        const compressedFile = await imageCompression(files[i], {
                            maxSizeMB: 1,
                            maxWidthOrHeight: 1024,
                            useWebWorker: true,
                        });
                        validFiles.push(compressedFile);
                    } catch (error) {
                        console.error("Erro ao comprimir a imagem:", error);
                        return;
                    }
                }
            }

            if (invalidFiles.length > 0) {
                return;
            }

            const readers = validFiles.map((file) => {
                const reader = new FileReader();
                return new Promise((resolve) => {
                    reader.onloadend = () => {
                        resolve({
                            name: file.name,
                            size: (file.size / 1024).toFixed(2) + " KB",
                            base64: reader.result,
                        });
                    };
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(readers).then((results) => {
                const allImages = results.map((result) => result.base64);
                const mainImage = allImages[0];
                const additionalImages = allImages.slice(1);

                setNewProduct((prevState) => ({
                    ...prevState,
                    mainImage,
                    images: additionalImages,
                }));
                setFileInfo((prevState) => [...prevState, ...results]);
            });
        }
    };

    const handleSizeChange = (size) => {
        setNewProduct((prevState) => {
            if (prevState.size.includes(size)) {
                return { ...prevState, size: prevState.size.filter((s) => s !== size) };
            } else {
                return { ...prevState, size: [...prevState.size, size] };
            }
        });
    };

    const handleRemoveImage = (index) => {
        setNewProduct((prevState) => ({
            ...prevState,
            images: prevState.images.filter((_, i) => i !== index),
        }));
        setFileInfo((prevState) => prevState.filter((_, i) => i !== index));
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(fileInfo);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setFileInfo(items);

        const mainImage = items[0].base64;
        const additionalImages = items.slice(1).map((item) => item.base64);

        setNewProduct((prevState) => ({
            ...prevState,
            mainImage,
            images: additionalImages,
        }));
    };

    return (
        <motion.div
            className="bg-white shadow-xl rounded-lg p-6 max-w-2xl mx-auto mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <h2 className="text-2xl font-bold mb-6 text-[#e40612]">Crie um novo produto</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Nome do Produto
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-2 focus:ring-[#e40612] focus:border-[#e40612]"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                            Preço
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            step="0.01"
                            className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-2 focus:ring-[#e40612] focus:border-[#e40612]"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Descrição
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        rows="3"
                        className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-2 focus:ring-[#e40612] focus:border-[#e40612] resize-none"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Categoria
                    </label>
                    <select
                        id="category"
                        name="category"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-2 focus:ring-[#e40612] focus:border-[#e40612]"
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

                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                        Quantidade em estoque
                    </label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={newProduct.quantity}
                        onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                        min="1"
                        className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-2 focus:ring-[#e40612] focus:border-[#e40612]"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Tamanhos disponíveis
                    </label>
                    <div className="flex space-x-2 mt-1">
                        {sizes.map((size) => (
                            <label key={size} className="flex items-center space-x-1">
                                <input
                                    type="checkbox"
                                    checked={newProduct.size.includes(size)}
                                    onChange={() => handleSizeChange(size)}
                                    className="form-checkbox h-4 w-4 text-red-600 rounded focus:ring-red-500"
                                />
                                <span>{size}</span>
                            </label>
                        ))}
                    </div>
                </div>

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
                        multiple
                    />
                    <label
                        htmlFor="images"
                        className="cursor-pointer bg-[#e40612] py-2 px-3 rounded-md shadow-sm text-base leading-4 font-semibold text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
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

                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-gray-600 bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e40612] disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                            Carregando...
                        </>
                    ) : (
                        <>
                            <PlusCircle className="mr-2 h-5 w-5" />
                            Criar Produto
                        </>
                    )}
                </button>
            </form>
        </motion.div>
    );
};

export default CreateProductForm;