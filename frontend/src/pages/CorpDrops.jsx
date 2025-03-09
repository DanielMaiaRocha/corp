import { useEffect, useState } from "react";
import { useUserStore } from "../../stores/useUserStore";
import { toast } from "react-hot-toast";

const CorpForm = () => {
  const { user, registerCorpForm } = useUserStore();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    sex: "",
    size: "",
    corpRec: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerCorpForm(formData);
      toast.success("Cadastro realizado com sucesso!");
    } catch (error) {
      console.error("Erro no cadastro:", error.response?.data || error.message);
      toast.error("Erro ao cadastrar formulário");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Cadastro para Drops</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Nome:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </label>

        <label className="block mb-2">
          Idade:
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full p-2 border rounded"
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
          Sexo:
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Selecione</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
        </label>

        <label className="block mb-2">
          Tamanho:
          <input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </label>

        <label className="block mb-2">
            Como conheceu a corp?
          <textarea
            name="corpRec"
            value={formData.corpRec}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </label>

        <button type="submit" className="w-full bg-red-500 text-white p-2 rounded mt-4">
          Enviar Cadastro
        </button>
      </form>
    </div>
  );
};

export default CorpForm;
