import { useEffect, useState } from "react";
import { useUserStore } from "../../stores/useUserStore";
import { toast } from "react-hot-toast";
import axios from "../../lib/axios";

const MyProfile = () => {
  const { user, getProfile, updateProfile } = useUserStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    zipCode: "",
  });

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",  // Correção aqui
        zipCode: user.zipCode || "",  // Correção aqui
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateProfile(formData); // Agora usando a função updateProfile do store
      toast.success("Profile updated successfully!");
      getProfile();
    } catch (error) {
      console.error("Profile update error:", error.response?.data || error.message);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">My Profile</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </label>

        <label className="block mb-2">
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
            className="w-full p-2 border rounded bg-gray-100"
          />
        </label>

        <label className="block mb-2">
          Telefone:
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </label>
        <label className="block mb-2">
          Endereço:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </label>
        <label className="block mb-2">
          Cep:
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </label>

        <button
          type="submit"
          className="w-full bg-red-500 text-white p-2 rounded mt-4"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default MyProfile;
