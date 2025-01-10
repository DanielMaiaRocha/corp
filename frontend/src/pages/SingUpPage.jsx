import { useState } from "react";
import { Link } from "react-router-dom";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader,
} from "lucide-react";
import { motion } from "framer-motion";

const SingUpPage = () => {
  const loading = false;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };
  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8 gap-10">
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="mt-6 text-center text-3xl font-extrabold text-black">
          Crie sua conta!
        </h2>
      </motion.div>
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md "
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="bg-gray-100 py-8 px-4 shadow max-w-xs md:max-w-full sm:rounded-lg sm:px-10">
          <div className="flex justify-center items-center">
            <img src="/logo.png" className="w-24 sm:w-40 sm:h-30" />
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-lg font-leagueGothic font-medium text-gray-700"
              >
                Nome completo
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-700" aria-label="true" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="block w-full px-3 py-2 pl-10 bg-white border-gray-400 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#e40612] focus:border-[#e40612] text-sm"
                  placeholder="Nome"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-lg font-leagueGothic font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-700" aria-label="true" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="block w-full px-3 py-2 pl-10 bg-white border-gray-400 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#e40612] focus:border-[#e40612] text-sm"
                  placeholder="Email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="senha"
                className="block text-lg font-leagueGothic font-medium text-gray-700"
              >
                Senha
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-700" aria-label="true" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.senha}
                  onChange={(e) =>
                    setFormData({ ...formData, senha: e.target.value })
                  }
                  className="block w-full px-3 py-2 pl-10 bg-white border-gray-400 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#e40612] focus:border-[#e40612] text-sm"
                  placeholder="Senha"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-lg font-leagueGothic font-medium text-gray-700"
              >
                Confirme sua senha
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-700" aria-label="true" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="block w-full px-3 py-2 pl-10 bg-white border-gray-400 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#e40612] focus:border-[#e40612] text-sm"
                  placeholder="Confirme sua senha"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium font-leagueGothic text-white bg-[#e40612] hover:bg-red-500 focus:outline-none focus:ring-2
              focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="mr-2 h-5 w-5 animate-spin" aria-hidden="true"/>
                  Loading...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" aria-hidden="true"/>
                  <span className="font-leagueGothic font-semibold">Cadastre-se</span>
                </>
              )}
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-gray-400">
            Já tem conta?{" "}
            <Link to="/login" className="font-medium font-leagueGothic text-red-500 hover:text-red-400 ">
              Logue aqui <ArrowRight className="inline h-4 w-4"/>
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SingUpPage;
