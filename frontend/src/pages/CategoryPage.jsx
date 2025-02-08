import { useEffect, useState } from "react";
import { useProductStore } from "../../stores/useProductStore";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";

const CategoryPage = () => {
	const { fetchAllProducts, products } = useProductStore();
	const [selectedCategory, setSelectedCategory] = useState("Todos");
	const [currentPage, setCurrentPage] = useState(1);
	const productsPerPage = 12; // Ajustado para combinar com o layout da imagem

	useEffect(() => {
		fetchAllProducts();
	}, [fetchAllProducts]);

	const filteredProducts = selectedCategory === "Todos"
		? products
		: products.filter((product) => product.category === selectedCategory);

	const indexOfLastProduct = currentPage * productsPerPage;
	const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
	const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

	const paginate = (pageNumber) => setCurrentPage(pageNumber);
	const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

	return (
		<div className="min-h-screen flex flex-col items-center mt-8">
			{/* Botões de Navegação e Filtro */}
			<div className="flex justify-between items-center w-full max-w-5xl px-4 mb-4">
				<div>
					<label htmlFor="category" className="mr-2 font-semibold text-gray-700">
						Categorias:
					</label>
					<select
						id="category"
						className="px-2 py-1 border rounded"
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
				<div>
					<button
						disabled={currentPage === 1}
						className={`px-4 py-2 rounded ${
							currentPage === 1
								? "bg-gray-300 text-gray-500 cursor-not-allowed"
								: "bg-red-500 text-white hover:bg-red-600"
						}`}
						onClick={() => paginate(currentPage - 1)}
					>
						&lt;
					</button>
					<span className="mx-2 font-semibold">{`Página ${currentPage} de ${totalPages}`}</span>
					<button
						disabled={currentPage === totalPages}
						className={`px-4 py-2 rounded ${
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

			{/* Grid de Produtos */}
			<div className="grid grid-cols-3 gap-4 w-full max-w-5xl">
				{currentProducts.length === 0 ? (
					<h2 className="text-2xl font-semibold text-gray-500 text-center col-span-3">
						Nenhum produto encontrado
					</h2>
				) : (
					currentProducts.map((product) => (
						<ProductCard key={product._id} product={product} />
					))
				)}
			</div>

			{/* Botões de Navegação Inferiores */}
			<div className="flex justify-between items-center w-full max-w-5xl px-4 mt-4">
				<button
					disabled={currentPage === 1}
					className={`px-4 py-2 rounded ${
						currentPage === 1
							? "bg-gray-300 text-gray-500 cursor-not-allowed"
							: "bg-red-500 text-white hover:bg-red-600"
					}`}
					onClick={() => paginate(currentPage - 1)}
				>
					&lt;
				</button>
				<span className="mx-2 font-semibold">{`Página ${currentPage} de ${totalPages}`}</span>
				<button
					disabled={currentPage === totalPages}
					className={`px-4 py-2 rounded ${
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
