import {
  /***User***/ Lock,
  LogIn,
  LogOut,
  ShoppingCart,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const user = false;
  const isAdmin = false;
  return (
    <header className="fixed top-0 left-0 w-full bg-white bg-opacity-90 backdrop-blur-0 z-40 transition-all duration-30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-row justify-between items-center">
        <Link to="/" className=" px-2 py-0.5 text-xs ">
          <img src="/logo.png" className="w-40 h-30" />
        </Link>
        <nav className="flex flex-wrap items-center gap-4  px-2 py-0.5 text-xs group-hover:text-gray-900 transition duration-300 ease-in-out">
          <Link
            to={"/featured"}
            className="font-leagueGothic text-sm font-bold group-hover:text-gray-900 transition duration-300 ease-in-out"
          >
            Novidades
          </Link>
          {user && (
            <Link to={"/cart"} className="relative group">
              <ShoppingCart
                className="inline-block mr-1 group-hover:text-gray-900"
                size={25}
              />
              <span className="absolute -top-2 -left-2 bg-[#e40612] text-white rounded-full px-2 py-0.5 text-xs group-hover:text-gray-900 transition duration-300 ease-in-out">
                3
              </span>
            </Link>
          )}
          {isAdmin && (
            <Link className="bg-[#e40612] hover:bg-red-500 text-white rounded-md py-1 px-3 text-xs font-leagueGothic font-semibold flex items-center justify-center group-hover:text-gray-900 transition duration-300 ease-in-out">
              <Lock className="inline-block mr-1" size={20} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          )}
          {user ? (
            <button className="bg-gray-700 hover:bg-gray-600 text-white font-leagueGothic font-semibold py-1.5 px-3 rounded-md flex items-center transition duration-300 ease-in-out">
              <LogOut size={18} />
            </button>
          ) : (
            <>
              <Link
                to={"/singup"}
                className="bg-[#e40612] hover:bg-red-500 text-white rounded-md py-1 px-3 text-lg font-leagueGothic font-semibold flex items-center justify-center group-hover:text-gray-900 transition duration-300 ease-in-out"
              >
                <UserPlus className="mr-2" size={18} />
                Cadastre-se
              </Link>
              <Link
                to={"/login"}
                className="bg-gray-700 hover:bg-gray-600 text-white rounded-md py-1 px-3 text-lg font-leagueGothic font-semibold flex items-center justify-center group-hover:text-gray-900 transition duration-300 ease-in-out"
              >
                <LogIn className="mr-2" size={18} />
                Login
              </Link>
            </>
          )}
        </nav>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
