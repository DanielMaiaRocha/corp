import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({}); // find all products
        res.json({ products });
    } catch (error) {
        console.log("Error in getAllProducts controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getFeaturedProducts = async (req, res) => {
    try {
        let featuredProducts = await redis.get("featured_products");
        if (featuredProducts) {
            return res.json(JSON.parse(featuredProducts));
        }
        featuredProducts = await Product.find({ isFeatured: true }).lean();

        if (!featuredProducts) {
            return res.status(404).json({ message: "No featured products found" });
        }

        // store in redis for future quick access
        await redis.set("featured_products", JSON.stringify(featuredProducts));

        res.json(featuredProducts);
    } catch (error) {
        console.log("Error in getFeaturedProducts controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, mainImage, images, category, size, quantity } = req.body;

        // Faz o upload da imagem principal para o Cloudinary
        const mainImageResponse = await cloudinary.uploader.upload(mainImage, { folder: "products" });

        // Faz o upload das imagens adicionais para o Cloudinary
        const uploadedImages = [];
        for (const image of images) {
            const cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
            uploadedImages.push(cloudinaryResponse.secure_url);
        }

        // Cria o produto no banco de dados
        const product = await Product.create({
            name,
            description,
            price,
            mainImage: mainImageResponse.secure_url, // URL da imagem principal
            images: uploadedImages, // Array de URLs das imagens adicionais
            category,
            size,
            quantity,
        });

        res.status(201).json(product);
    } catch (error) {
        console.log("Error in createProduct controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Deleta todas as imagens do Cloudinary
        if (product.images && product.images.length > 0) {
            for (const imageUrl of product.images) {
                const publicId = imageUrl.split("/").pop().split(".")[0];
                try {
                    await cloudinary.uploader.destroy(`products/${publicId}`);
                    console.log(`Deleted image from Cloudinary: ${publicId}`);
                } catch (error) {
                    console.log("Error deleting image from Cloudinary", error);
                }
            }
        }

        await Product.findByIdAndDelete(req.params.id);

        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.log("Error in deleteProduct controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample: { size: 4 },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    images: 1, // Alterado de 'image' para 'images'
                    price: 1,
                },
            },
        ]);

        res.json(products);
    } catch (error) {
        console.log("Error in getRecommendedProducts controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getProductsByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const products = await Product.find({ category });
        res.json({ products });
    } catch (error) {
        console.log("Error in getProductsByCategory controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const toggleFeaturedProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            product.isFeatured = !product.isFeatured;
            const updatedProduct = await product.save();
            await updateFeaturedProductsCache();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.log("Error in toggleFeaturedProduct controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

async function updateFeaturedProductsCache() {
    try {
        const featuredProducts = await Product.find({ isFeatured: true }).lean();
        await redis.set("featured_products", JSON.stringify(featuredProducts));
    } catch (error) {
        console.log("error in update cache function");
    }
}

const extractPublicId = (url) => {
    const matches = url.match(/\/v\d+\/(.+?)\./);
    return matches ? matches[1] : null;
  };
  
  // Função para excluir uma imagem do Cloudinary
  const deleteImageFromCloudinary = async (imageUrl, folder = "products") => {
    const publicId = extractPublicId(imageUrl);
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(`${folder}/${publicId}`);
      } catch (error) {
        console.error(`Error deleting image from Cloudinary: ${error.message}`);
      }
    }
  };
  
  // Função para fazer upload de uma imagem para o Cloudinary
  const uploadImageToCloudinary = async (image, folder = "products") => {
    try {
      const response = await cloudinary.uploader.upload(image, { folder });
      return response.secure_url;
    } catch (error) {
      console.error(`Error uploading image to Cloudinary: ${error.message}`);
      throw new Error("Failed to upload image");
    }
  };
  
  // Controlador para atualizar um produto
  export const updateProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        price,
        mainImage,
        images,
        category,
        size,
        quantity,
      } = req.body;
  
      // Verifica se o produto existe
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // Atualiza a imagem principal, se fornecida
      let newMainImageUrl = product.mainImage;
      if (mainImage && mainImage !== product.mainImage) {
        // Exclui a imagem principal antiga
        await deleteImageFromCloudinary(product.mainImage);
  
        // Faz o upload da nova imagem principal
        newMainImageUrl = await uploadImageToCloudinary(mainImage);
      }
  
      // Atualiza as imagens adicionais, se fornecidas
      let newImagesUrls = product.images;
      if (images && images.length > 0 && JSON.stringify(images) !== JSON.stringify(product.images)) {
        // Exclui as imagens adicionais antigas
        await Promise.all(
          product.images.map((imageUrl) => deleteImageFromCloudinary(imageUrl))
        );
  
        // Faz o upload das novas imagens adicionais
        newImagesUrls = await Promise.all(
          images.map((image) => uploadImageToCloudinary(image))
        );
      }
  
      // Atualiza os campos do produto
      const updatedFields = {
        name: name || product.name,
        description: description || product.description,
        price: price || product.price,
        mainImage: newMainImageUrl,
        images: newImagesUrls,
        category: category || product.category,
        size: size || product.size,
        quantity: quantity || product.quantity,
      };
  
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        updatedFields,
        { new: true } // Retorna o documento atualizado
      );
  
      res.json(updatedProduct);
    } catch (error) {
      console.error("Error in updateProduct controller:", error.message);
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  };