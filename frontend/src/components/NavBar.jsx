import {
  Lock,
  LogIn,
  LogOut,
  ShoppingCart,
  User,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "../../stores/useCartStore";
import { useUserStore } from "../../stores/useUserStore";
import { useState } from "react";

const NavBar = () => {
  const { user, logout } = useUserStore();
  const isAdmin = user?.role === "admin";
  const { cart } = useCartStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white bg-opacity-90 backdrop-blur-0 z-40 transition-all duration-300 ">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="px-2 py-0.5">
            <img src="/logo.png" className="w-40 h-auto" alt="Logo" />
          </Link>

          {/* Links centralizados */}
          <nav className="absolute left-1/2 transform -translate-x-1/2 flex gap-6">
            <Link
              to="/featured"
              className="font-leagueGothic text-lg font-bold text-gray-800 hover:text-gray-900 transition duration-300 ease-in-out"
            >
              Novidades
            </Link>
            <Link
              to="/featured"
              className="font-leagueGothic text-lg font-bold text-gray-800 hover:text-gray-900 transition duration-300 ease-in-out"
            >
              Roupas
            </Link>
            <Link
              to="/featured"
              className="font-leagueGothic text-lg font-bold text-gray-800 hover:text-gray-900 transition duration-300 ease-in-out"
            >
              Drops
            </Link>
            <Link
              to="/featured"
              className="font-leagueGothic text-lg font-bold text-gray-800 hover:text-gray-900 transition duration-300 ease-in-out"
            >
              Mídias
            </Link>
            <Link
              to="/featured"
              className="font-leagueGothic text-lg font-bold text-gray-800 hover:text-gray-900 transition duration-300 ease-in-out"
            >
              Sobre a Corp
            </Link>
          </nav>

          {/* Ações à direita */}
          <div className="flex items-center gap-4 relative">
            {user && (
              <Link
                to="/cart"
                className="relative text-gray-900 hover:text-red-600 transition duration-300 text-base font-semibold"
              >
                <ShoppingCart size={20} className="inline-block mr-1 mb-1" />
                <span className="hidden sm:inline">Cart</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -left-2 bg-[#e40612] text-white rounded-full px-2 py-0.5 text-xs">
                    {cart.length}
                  </span>
                )}
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/adm-dashboard"
                className="bg-[#e40612] hover:bg-red-500 text-white px-3 py-1 rounded-md font-medium transition duration-300 flex items-center"
              >
                <Lock className="inline-block mr-1" size={20} />
                <span className="hidden sm:inline text-base font-semibold">
                  Dashboard
                </span>
              </Link>
            )}

            {/* Menu de login/cadastro */}
            {!user && (
              <div className="relative">
                <button
                  onClick={toggleMenu}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300"
                >
                  <User size={20} />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md overflow-hidden">
                    <Link
                      to="/signup"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Cadastre-se
                    </Link>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Login
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Opção de Logout */}
            {user && (
              <button
                onClick={logout}
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
