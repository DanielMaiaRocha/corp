import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useProductStore } from "../../stores/useProductStore";

const categories = ["Blusas", "Regatas", "Calças", "Bones", "Jaquetas", "Casacos"];
const sizes = ["PP", "P", "M", "G", "GG"]; // Lista de tamanhos disponíveis

const CreateProductForm = () => {
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
        size: sizes, // Por padrão, todos os tamanhos estão selecionados
    });

    const [fileInfo, setFileInfo] = useState(null); // Estado para armazenar informações do arquivo
    const [error, setError] = useState(""); // Estado para mensagens de erro

    const { createProduct, loading } = useProductStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createProduct(newProduct);
            setNewProduct({ name: "", description: "", price: "", category: "", image: "", size: sizes });
            setFileInfo(null); // Limpa as informações do arquivo após o envio
            setError(""); // Limpa o erro após o sucesso
        } catch {
            console.log("error creating a product");
            setError("Erro ao criar o produto. Tente novamente.");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Verifica o tamanho da imagem (em bytes)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                setError("A imagem deve ter no máximo 5MB.");
                return; // Impede o processamento da imagem
            }

            const reader = new FileReader();

            reader.onloadend = () => {
                setNewProduct({ ...newProduct, image: reader.result });
                setFileInfo({
                    name: file.name,
                    size: (file.size / 1024).toFixed(2) + " KB", // Tamanho em KB
                });
                setError(""); // Limpa o erro após o sucesso
            };

            reader.readAsDataURL(file); // Converte a imagem para base64
        }
    };

    const handleSizeChange = (size) => {
        // Atualiza o estado dos tamanhos selecionados
        setNewProduct((prevState) => {
            if (prevState.size.includes(size)) {
                // Remove o tamanho se já estiver selecionado
                return { ...prevState, size: prevState.size.filter((s) => s !== size) };
            } else {
                // Adiciona o tamanho se não estiver selecionado
                return { ...prevState, size: [...prevState.size, size] };
            }
        });
    };

    return (
        <motion.div
            className='bg-gray-100 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <h2 className='text-2xl font-semibold mb-6 text-[#e40612]'>Crie um novo produto</h2>

            {/* Exibe mensagens de erro */}
            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
                        Nome do Produto
                    </label>
                    <input
                        type='text'
                        id='name'
                        name='name'
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className='mt-1 block w-full bg-white border border-gray-100 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-1 focus:ring-[#e40612] focus:border-[#e40612]'
                        required
                    />
                </div>

                <div>
                    <label htmlFor='description' className='block text-sm font-medium text-gray-700'>
                        Descrição
                    </label>
                    <textarea
                        id='description'
                        name='description'
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        rows='3'
                        className='mt-1 block w-full bg-white border border-gray-100 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-1 focus:ring-[#e40612] focus:border-[#e40612] resize-none'
                        required
                    />
                </div>

                <div>
                    <label htmlFor='price' className='block text-sm font-medium text-gray-700'>
                        Preço
                    </label>
                    <input
                        type='number'
                        id='price'
                        name='price'
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        step='0.01'
                        className='mt-1 block w-full bg-white border border-gray-100 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-1 focus:ring-[#e40612] focus:border-[#e40612]'
                        required
                    />
                </div>

                <div>
                    <label htmlFor='category' className='block text-sm font-medium text-gray-700'>
                        Categoria
                    </label>
                    <select
                        id='category'
                        name='category'
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className='mt-1 block w-full bg-white border border-gray-100 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-1 focus:ring-[#e40612] focus:border-[#e40612]'
                        required
                    >
                        <option value=''>Selecione uma categoria</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className='block text-sm font-medium text-gray-700'>
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

                <div className='mt-1 flex items-center'>
                    <input type='file' id='image' className='sr-only' accept='image/*' onChange={handleImageChange} />
                    <label
                        htmlFor='image'
                        className='cursor-pointer bg-[#e40612] py-2 px-3 rounded-md shadow-sm text-base leading-4 font-semibold text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
                    >
                        <Upload className='h-5 w-5 inline-block mr-2' />
                        Upload Image
                    </label>
                    {fileInfo && (
                        <div className='ml-3 text-sm text-gray-700'>
                            <p>{fileInfo.name}</p>
                            <p className="text-gray-500">{fileInfo.size}</p>
                        </div>
                    )}
                </div>

                <button
                    type='submit'
                    className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-gray-600 bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e40612] disabled:opacity-50'
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
                            Carregando...
                        </>
                    ) : (
                        <>
                            <PlusCircle className='mr-2 h-5 w-5' />
                            Criar Produto
                        </>
                    )}
                </button>
            </form>
        </motion.div>
    );
};

export default CreateProductForm;