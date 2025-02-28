import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useCarouselStore = create((set) => ({
  images: [],
  loading: false,

  fetchCarouselImages: async () => {
    set({ loading: true });
    try {
      const { data } = await axios.get("/carousel");
      set({ images: data, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error("Failed to fetch carousel images");
    }
  },

  addCarouselImage: async (imageBase64) => {
    set({ loading: true });
    try {
      const { data } = await axios.post("/carousel", { image: imageBase64 });
      set((state) => ({ images: [...state.images, data], loading: false }));
      toast.success("Image added successfully!");
    } catch (error) {
      set({ loading: false });
      toast.error("Failed to add image");
    }
  },

  deleteCarouselImage: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`/carousel/${id}`);
      set((state) => ({
        images: state.images.filter((img) => img._id !== id),
        loading: false,
      }));
      toast.success("Image deleted successfully!");
    } catch (error) {
      set({ loading: false });
      toast.error("Failed to delete image");
    }
  },
}));
