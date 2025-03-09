import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AdminPage from "./pages/AdminPage";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import ProductPage from "./pages/ProductPage";
import SobreCorp from "./pages/SobreCorp";
import Midias from "./pages/Midias";
import MyProfile from "./pages/MyProfile";
import CorpForm from "./pages/CorpDrops";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems } = useCartStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) {
      getCartItems();
    }
  }, [getCartItems, user]);

  // Simula um tempo de carregamento de 2 segundos antes de exibir o site
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (checkingAuth || isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-white text-black relative flex flex-col">
      <NavBar />
      <div className="flex-1 pt-36 relative z-10">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/SobreCorp" element={<SobreCorp />} />
          <Route path="/Midias" element={<Midias />} />
          <Route
            path="/signup"
            element={!user ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/adm-dashboard"
            element={
              user && user?.role === "admin" ? (
                <AdminPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/myProfile" element={<MyProfile />} />
          <Route path="/CorpDrops" element={<CorpForm />} />
          <Route
            path="/cart"
            element={user ? <CartPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/purchase-success"
            element={user ? <PurchaseSuccessPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/purchase-cancel"
            element={user ? <PurchaseCancelPage /> : <Navigate to="/login" />}
          />
        </Routes>
        <Footer />
      </div>
      <Toaster />
    </div>
  );
}

export default App;
