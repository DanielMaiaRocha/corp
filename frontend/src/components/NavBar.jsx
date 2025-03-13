import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, LogOut, ShoppingCart, User, Menu, X } from "lucide-react";
import { useCartStore } from "../../stores/useCartStore";
import { useUserStore } from "../../stores/useUserStore";

const NavBar = () => {
  const { user, logout } = useUserStore();
  const isAdmin = user?.role === "admin";
  const { cart } = useCartStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleProfileMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white bg-opacity-90 backdrop-blur-0 z-20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="px-2 py-0.5">
            <img src="/logo.png" className="w-32 md:w-40 h-auto" alt="Logo" />
          </Link>

          {/* Links Desktop */}
          <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-6">
            <Link
              to="/SobreCorp"
              className="font-bold text-gray-800 hover:text-gray-900 transition"
            >
              Sobre a Corp
            </Link>
            <Link
              to="/category/products"
              className="font-bold text-gray-800 hover:text-gray-900 transition"
            >
              Drops
            </Link>
            <Link
              to="/Midias"
              className="font-bold text-gray-800 hover:text-gray-900 transition"
            >
              Midias
            </Link>
            <Link
              to="/CorpDrops"
              className="font-bold text-gray-800 hover:text-gray-900 transition"
            >
              Creative Corporation
            </Link>
          </nav>

          {/* Ícones */}
          <div className="flex items-center gap-4 relative">
            {user && (
              <Link
                to="/cart"
                className="relative text-gray-900 hover:text-red-600 transition"
              >
                <ShoppingCart size={20} />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#e40612] text-white rounded-full px-1.5 py-0.5 text-xs">
                    {cart.length}
                  </span>
                )}
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/adm-dashboard"
                className="bg-[#e40612] hover:bg-red-500 text-white px-3 py-1 rounded-md flex items-center justify-center transition"
              >
                <Lock className="mr-1" size={20} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}

            {/* Ícone de Perfil */}
            <div className="relative">
              <button
                onClick={toggleProfileMenu}
                className="text-black py-2 px-3 rounded-md flex items-center transition"
              >
                <User size={28} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md overflow-hidden z-30">
                  {!user ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <Link
                        to="/myProfile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Meu Perfil
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Sair
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Menu Hambúrguer (Mobile) */}
            <button
              className="md:hidden text-gray-800 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile (Dropdown) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-20 left-0 w-full bg-white shadow-md z-50 py-4 transition-all duration-300">
          <nav className="flex flex-col items-center gap-4">
            <Link
              to="/SobreCorp"
              className="text-gray-800 hover:text-red-600 transition font-bold"
              onClick={toggleMobileMenu}
            >
              Sobre a Corp
            </Link>
            <Link
              to="/category/products"
              className="text-gray-800 hover:text-red-600 transition font-bold"
              onClick={toggleMobileMenu}
            >
              Drops
            </Link>
            <Link
              to="/Midias"
              className="text-gray-800 hover:text-red-600 transition font-bold"
              onClick={toggleMobileMenu}
            >
              Midias
            </Link>
            <Link
              to="/CorpDrops"
              className="text-gray-800 hover:text-red-600 transition font-bold"
              onClick={toggleMobileMenu}
            >
              Creative Corporation
            </Link>

            {/* Links adicionais apenas para o menu mobile */}
            <a
              href="https://rastreamento.correios.com.br/app/index.php"
              className="text-gray-600 hover:text-red-600 transition font-light"
              onClick={toggleMobileMenu}
            >
              Rastreio
            </a>
            <a
              href="/FAQ"
              className="text-gray-600 hover:text-red-600 transition font-light"
              onClick={toggleMobileMenu}
            >
              FAQ
            </a>
            <a
              href="https://wa.me"
              className="text-gray-600 hover:text-red-600 transition font-light"
              onClick={toggleMobileMenu}
            >
              Ajuda
            </a>
            <a
              href="https://wa.me"
              className="text-gray-600 hover:text-red-600 transition font-light"
              onClick={toggleMobileMenu}
            >
              Trocas e Devoluções
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;