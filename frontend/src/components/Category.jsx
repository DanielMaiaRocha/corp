import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CategoryItem = ({ category = {} }) => {
  return (
    <div className="relative group rounded-sm overflow-hidden h-[540px] max-w-[250%]">
      <Link to={category?.href ? `/category${category.href}` : "#"}>
        {/* Imagem com Overlay */}
        <div
          className="h-full w-full relative"
          style={{
            background: `url(${category?.imageUrl || "default-image-url.jpg"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay escuro */}
          <div className="absolute inset-0 bg-[#181818] bg-opacity-0 group-hover:bg-opacity-80 flex items-center justify-center transition-all duration-500" />

          {/* Texto animado */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-center"
            initial={{ opacity: 0, y: 50 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-2">{category?.name || "Default Name"}</h3>
              <p className="text-gray-300 text-sm">Explore {category?.name || "Category"}</p>
            </div>
          </motion.div>
        </div>

        {/* Texto fixo abaixo da imagem */}
        <div className="bg-[#181818] text-white py-6 px-4 rounded-b-lg">
          <h3 className="text-xl font-semibold mb-2">{category?.name || "Default Name"}</h3>
          <p className="text-[#ADB7BE] text-sm">
            Explore {category?.name || "Category"}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default CategoryItem;
