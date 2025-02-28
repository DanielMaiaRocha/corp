import { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import FeaturedProducts from "../components/FeaturedProducts";
import { useProductStore } from "../../stores/useProductStore";
import { useCarouselStore } from "../../stores/useCarouselStore";

const HomePage = () => {
  const { fetchFeaturedProducts, products, isLoading } = useProductStore();
  const { fetchCarouselImages, images: carouselImages } = useCarouselStore();

  useEffect(() => {
    fetchFeaturedProducts();
    fetchCarouselImages();
  }, [fetchFeaturedProducts, fetchCarouselImages]);

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Carrossel de Imagens */}
      <div className="relative z-10 max-w-[110rem] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          className="w-full"
        >
          {carouselImages.map((image) => (
            <SwiperSlide key={image._id} className="flex justify-center">
              {/* Ajuste no tamanho das imagens */}
              <div className="w-full h-[700px] overflow-hidden shadow-lg">
                <img
                  src={image.imageUrl}
                  alt="Carousel"
                  className="w-full h-full object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* Produtos em destaque */}
      {!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}
    </div>
  );
};

export default HomePage;
