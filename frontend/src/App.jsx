import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import SingUpPage from "./pages/SingUpPage";
import NavBar from "./components/NavBar";

function App() {
  return (
    <div className="min-h-screen bg-[#fff] text-black relative overflow-hidden">
      <div className="relative z-50 pt-36">
        <NavBar />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/singup" element={<SingUpPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
