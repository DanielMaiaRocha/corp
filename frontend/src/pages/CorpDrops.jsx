import { useEffect, useState } from "react";
import { useUserStore } from "../../stores/useUserStore";
import { toast } from "react-hot-toast";

const CorpForm = () => {
  const { user, corpForm, registerCorpForm, fetchCorpForm } = useUserStore();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    sex: "",
    size: "",
    corpRec: "",
  });

  useEffect(() => {
    const loadFormData = async () => {
      if (user) {
        // Preenche os campos do usuário
        setFormData((prev) => ({
          ...prev,
          name: user.name || "",
          phone: user.phone || "",
        }));

        // Busca o formulário do usuário, se existir
        try {
          await fetchCorpForm(); // Chama a função para buscar o formulário pelo usuário logado
        } catch (error) {
          console.error("Erro ao buscar formulário:", error);
        }
      }
    };

    loadFormData();
  }, [user, fetchCorpForm]);

  // Atualiza o estado do formulário com os dados existentes
  useEffect(() => {
    if (corpForm) {
      setFormData({
        name: corpForm.name || user?.name || "",
        age: corpForm.age || "",
        phone: corpForm.phone || user?.phone || "",
        sex: corpForm.sex || "",
        size: corpForm.size[0] || "", // Converte o array de tamanho para um valor único
        corpRec: corpForm.corpRec || "",
      });
    }
  }, [corpForm, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ajusta os dados para corresponder ao esperado pelo backend
    const payload = {
      ...formData,
      size: [formData.size], // Converte o valor único em um array
    };

    try {
      await registerCorpForm(payload);
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
            required
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
            required
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
            required
          />
        </label>

        <label className="block mb-2">
          Sexo:
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Selecione</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
          </select>
        </label>

        <label className="block mb-2">
          Tamanho:
          <select
            name="size"
            value={formData.size}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Selecione</option>
            <option value="PP">PP</option>
            <option value="P">P</option>
            <option value="M">M</option>
            <option value="G">G</option>
            <option value="GG">GG</option>
          </select>
        </label>

        <label className="block mb-2">
          Como conheceu a corp?
          <textarea
            name="corpRec"
            value={formData.corpRec}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </label>

        <button type="submit" className="w-full bg-red-500 text-white p-2 rounded mt-4">
          {corpForm ? "Atualizar Cadastro" : "Enviar Cadastro"}
        </button>
      </form>
    </div>
  );
};

export default CorpForm;