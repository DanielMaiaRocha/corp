import Carousel from "../models/carousel.model.js";
import cloudinary from "../lib/cloudinary.js";

// Listar todas as imagens do carrossel
export const getCarouselImages = async (req, res) => {
  try {
    console.log("Buscando imagens do carrossel...");
    const images = await Carousel.find();

    if (!images.length) {
      console.warn("Nenhuma imagem encontrada no carrossel.");
      return res.status(404).json({ message: "No images found" });
    }

    console.log("Imagens encontradas:", images.length);
    res.status(200).json(images);
  } catch (error) {
    console.error("Erro ao buscar imagens do carrossel:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Adicionar nova imagem ao carrossel
export const addCarouselImage = async (req, res) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      console.warn("Nenhuma imagem foi enviada.");
      return res.status(400).json({ message: "Image is required" });
    }

    console.log("Enviando imagem para Cloudinary...");
    const uploadResponse = await cloudinary.uploader.upload(image, { folder: "carousel" });

    console.log("Upload realizado com sucesso:", uploadResponse.secure_url);
    
    const newImage = await Carousel.create({ imageUrl: uploadResponse.secure_url });
    res.status(201).json(newImage);
  } catch (error) {
    console.error("Erro ao adicionar imagem ao carrossel:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Remover imagem do carrossel
export const deleteCarouselImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Carousel.findById(id);

    if (!image) {
      console.warn("Imagem não encontrada.");
      return res.status(404).json({ message: "Image not found" });
    }

    // Extraindo o publicId corretamente
    const publicId = image.imageUrl.split("/").slice(-1)[0].split(".")[0];

    console.log("Removendo imagem do Cloudinary:", publicId);
    await cloudinary.uploader.destroy(`carousel/${publicId}`);

    await Carousel.findByIdAndDelete(id);
    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Erro ao deletar imagem do carrossel:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
