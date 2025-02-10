import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CategoryItem = ({ category = {} }) => {
  return (
    <div className="relative group overflow-hidden h-[700px] max-w-full">
        {/* Imagem com Overlay */}
        <motion.div
          className="h-full w-full relative overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <img
            src={category?.imageUrl || "default-image-url.jpg"}
            alt={category?.name || "Categoria"}
            className="w-full h-full object-cover transition-transform duration-500 "
          />
        
      </motion.div>
    </div>
  );
};

export default CategoryItem;
