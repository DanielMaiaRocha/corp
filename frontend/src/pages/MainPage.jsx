import { useEffect } from "react";
import CategoryItem from "../components/Category";
import { useProductStore } from "../../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";

const categories = [
  { href: "/produtos", name: "Produtos", imageUrl: "/images/corp3.png" },
  { href: "/midia", name: "Midias", imageUrl: "/images/corp2.png" },
  { href: "/SobreCorp", name: "Sobre a Corp", imageUrl: "/images/corp1.png" },
];

const HomePage = () => {
  const { fetchFeaturedProducts, products, isLoading } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20">
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>
        {!isLoading && products.length > 0 && (
          <FeaturedProducts featuredProducts={products} />
        )}
      </div>
      <div></div>
    </div>
  );
};
export default HomePage;
