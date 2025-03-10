import CorpForm from "../models/corp.model.js"; // Importe o novo modelo
import User from "../models/user.model.js"; // Importe o modelo User para verificar o usuário

export const registerCorpForm = async (req, res) => {
  try {
    const userId = req.user._id; // ID do usuário autenticado
    const { name, age, phone, sex, size, corpRec } = req.body;

    // Verifica se o usuário existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verifica se o usuário já preencheu o formulário
    const existingForm = await CorpForm.findOne({ user: userId });
    if (existingForm) {
      return res.status(400).json({ message: "User already has a form registered" });
    }

    // Cria um novo formulário
    const newForm = new CorpForm({
      user: userId,
      name,
      age,
      phone,
      sex,
      size,
      corpRec,
    });

    // Salva o formulário no banco de dados
    await newForm.save();

    res.status(201).json({ message: "Form registered successfully", form: newForm });
  } catch (error) {
    console.error("Erro no cadastro:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getCorpFormByUser = async (req, res) => {
  try {
    const userId = req.user._id; // Obtém o ID do usuário logado

    // Busca o formulário associado ao usuário logado
    const form = await CorpForm.findOne({ user: userId });

    if (!form) {
      return res.status(404).json({ message: "Formulário não encontrado" });
    }

    // Retorna o formulário encontrado
    res.status(200).json({ form });
  } catch (error) {
    console.error("Erro ao buscar formulário:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};