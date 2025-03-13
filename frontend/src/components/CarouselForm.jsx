import React, { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import { useCarouselStore } from "../../stores/useCarouselStore";
import toast from "react-hot-toast";

const CarouselForm = () => {
  const [carouselSlots, setCarouselSlots] = useState([
    { id: null, imageUrl: "", newImage: null },
    { id: null, imageUrl: "", newImage: null },
    { id: null, imageUrl: "", newImage: null },
  ]);

  const { images, fetchCarouselImages, addCarouselImage, deleteCarouselImage, loading } = useCarouselStore();

  useEffect(() => {
    const loadCarousel = async () => {
      await fetchCarouselImages();
      const currentImages = useCarouselStore.getState().images;
      const slots = [
        { id: null, imageUrl: "", newImage: null },
        { id: null, imageUrl: "", newImage: null },
        { id: null, imageUrl: "", newImage: null },
      ];
      currentImages.slice(0, 3).forEach((img, index) => {
        slots[index] = { id: img._id, imageUrl: img.imageUrl, newImage: null };
      });
      setCarouselSlots(slots);
    };

    loadCarousel();
  }, [fetchCarouselImages]);

  const handleFileChange = async (index, event) => {
    const file = event.target.files[0];
    if (!file) return;
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error(`A imagem ${file.name} excede 5MB`);
      return;
    }
    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setCarouselSlots((prev) => {
          const newSlots = [...prev];
          newSlots[index] = { ...newSlots[index], imageUrl: base64, newImage: base64 };
          return newSlots;
        });
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Erro ao processar imagem:", error);
      toast.error("Erro ao processar imagem");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (let i = 0; i < carouselSlots.length; i++) {
      const slot = carouselSlots[i];
      if (slot.newImage) {
        if (slot.id) {
          try {
            await deleteCarouselImage(slot.id);
          } catch (error) {
            console.error("Erro ao deletar imagem:", error);
            toast.error("Erro ao atualizar imagem");
            return;
          }
        }
        try {
          const response = await addCarouselImage(slot.newImage);
          setCarouselSlots((prev) => {
            const newSlots = [...prev];
            newSlots[i] = {
              id: response._id || null,
              imageUrl: response.imageUrl || slot.imageUrl,
              newImage: null,
            };
            return newSlots;
          });
        } catch (error) {
          console.error("Erro ao adicionar imagem:", error);
          toast.error("Erro ao adicionar imagem");
          return;
        }
      }
    }
    toast.success("Carrossel atualizado com sucesso!");
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-xl rounded-lg p-6 mb-20">
      <h2 className="text-2xl font-semibold mb-6 text-[#e40612]">Atualizar Carrossel</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {carouselSlots.map((slot, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-full h-40 border rounded-lg overflow-hidden mb-2 shadow-sm">
                {slot.imageUrl ? (
                  <img src={slot.imageUrl} alt={`Carrossel ${index + 1}`} className="object-cover w-full h-full" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">Nenhuma imagem</div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(index, e)}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#e40612] file:text-white hover:file:bg-red-600 transition-colors duration-200"
              />
              <p className="text-sm text-gray-600 mt-2">Imagem {index + 1}</p>
            </div>
          ))}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#e40612] text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-200 disabled:opacity-50"
        >
          {loading ? "Atualizando..." : "Atualizar Carrossel"}
        </button>
      </form>
    </div>
  );
};

export default CarouselForm;