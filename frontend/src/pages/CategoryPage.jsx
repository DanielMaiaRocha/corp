import { useEffect, useState } from "react";
import { useProductStore } from "../../stores/useProductStore";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";

const CategoryPage = () => {
    const { fetchAllProducts, products } = useProductStore();
    const [selectedCategory, setSelectedCategory] = useState("Todos");
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12; // Número de produtos por página

    useEffect(() => {
        fetchAllProducts();
    }, [fetchAllProducts]);

    // Filtra os produtos pela categoria selecionada
    const filteredProducts = selectedCategory === "Todos"
        ? products
        : products.filter((product) => product.category === selectedCategory);

    // Lógica de paginação
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="min-h-screen flex flex-col items-center mt-8 mb-10">
            {/* Filtro de Categorias */}
            <div className="w-full max-w-6xl px-4 mb-6">
                <label htmlFor="category" className="mr-2 font-semibold text-gray-700">
                    Categorias:
                </label>
                <select
                    id="category"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    {["Todos", "Blusas", "Regatas", "Calças", "Bones", "Jaquetas", "Casacos"].map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            {/* Grade de Produtos */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full max-w-6xl px-4">
                {currentProducts.length === 0 ? (
                    <h2 className="text-2xl font-semibold text-gray-500 text-center col-span-full">
                        Nenhum produto encontrado
                    </h2>
                ) : (
                    currentProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))
                )}
            </div>

            {/* Paginação */}
            <div className="flex justify-center items-center w-full max-w-6xl px-4 mt-8">
                <button
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg ${
                        currentPage === 1
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                    onClick={() => paginate(currentPage - 1)}
                >
                    &lt;
                </button>
                <span className="mx-4 font-semibold text-gray-700">
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg ${
                        currentPage === totalPages
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                    onClick={() => paginate(currentPage + 1)}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default CategoryPage;