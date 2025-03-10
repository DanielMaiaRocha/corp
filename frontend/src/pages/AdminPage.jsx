import { BarChart, PlusCircle, ShoppingBasket, Image } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import AnalyticsTab from "../components/UsersTab";
import CreateProductForm from "../components/CreateProductForm";
import CarouselForm from "../components/CarouselForm"; 	
import ProductsList from "../components/ProductsList";
import { useProductStore } from "../../stores/useProductStore";
import UsersList from "../components/UsersTab";

const tabs = [
	{ id: "create", label: "Novo Produto", icon: PlusCircle },
	{ id: "products", label: "Painel dos Produtos", icon: ShoppingBasket },
	{ id: "carousel", label: "Editar Fotos", icon: Image },
	{ id: "analytics", label: "Analitico", icon: BarChart },
];

const AdminPage = () => {
	const [activeTab, setActiveTab] = useState("create");
	const { fetchAllProducts } = useProductStore();
	const [selectedProduct, setSelectedProduct] = useState(null);

	useEffect(() => {
		fetchAllProducts();
	}, [fetchAllProducts]);

	// Função para abrir a aba de edição com o produto selecionado
	const handleEditProduct = (product) => {
		setSelectedProduct(product);
		setActiveTab("edit");
	};

	return (
		<div className='min-h-screen relative overflow-hidden'>
			<div className='relative z-10 container mx-auto px-4 py-16'>
				<motion.h1
					className='text-4xl font-bold mb-8 text-black text-center'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					Admin Dashboard
				</motion.h1>

				<div className='flex justify-center mb-8'>
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${
								activeTab === tab.id
									? "bg-[#e40612] text-white"
									: "bg-gray-50 text-black hover:bg-gray-300"
							}`}
						>
							<tab.icon className='mr-2 h-5 w-5' />
							{tab.label}
						</button>
					))}
				</div>

				{/* Renderização Condicional das Abas */}
				{activeTab === "create" && <CreateProductForm />}
				{activeTab === "products" && <ProductsList onEditProduct={handleEditProduct} />}
				{activeTab === "carousel" && <CarouselForm />} 
				{activeTab === "analytics" && <UsersList activeTab={activeTab} />}
			</div>
		</div>
	);
};

export default AdminPage;
