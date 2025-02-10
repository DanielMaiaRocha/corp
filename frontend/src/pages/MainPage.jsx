import { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import CategoryItem from "../components/Category";
import { useProductStore } from "../../stores/useProductStore";

const categories = [
  { imageUrl: "/images/corp3.png" },
  { imageUrl: "/images/corp2.png" },
  { imageUrl: "/images/corp1.png" },
];

const HomePage = () => {
  const { fetchFeaturedProducts, products, isLoading } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="relative z-10 max-w-[110rem] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={1} // Padrão: 1 imagem por slide
          breakpoints={{
            640: { slidesPerView: 1 }, // Mobile: 1 imagem por slide
            768: { slidesPerView: 2 }, // Tablets: 2 imagens por slide
            1024: { slidesPerView: 3 }, // Desktop: 3 imagens por slide
          }}
          autoplay={{ delay: 3000, disableOnInteraction: false }} // Slide automático
          className="w-full"
        >
          {categories.map((category) => (
            <SwiperSlide key={category.name} className="flex justify-center">
              <CategoryItem category={category} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HomePage;
