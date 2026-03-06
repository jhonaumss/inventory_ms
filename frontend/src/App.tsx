import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";

import { UsersPage } from "./pages/UsersPage";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Navbar } from "./components/NavBar";
import LoginPage from "./pages/LoginPage";
import { PrivateRoute } from "./components/PrivateRoute";
import { AddEditUserPage } from "./pages/AddEditUserPage";
import ProductsPage from "./pages/ProductsPage";
import { AddEditProductPage } from "./pages/AddEditProductPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import { ToastContainer } from "react-toastify";
import { MovementPage } from "./pages/MovementPage";

function Layout() {
  const { token, user, roles } = useContext(AuthContext);
  const location = useLocation();

  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  const getDefaultRedirect = () => {
    if (!user) return "/login";

    if (roles.includes("ROLE_ADMIN")) return "/users";
    if (roles.includes("ROLE_MANAGER") || roles.includes("ROLE_SALES"))
      return "/products";

    return "/login";
  };

  return (
    <>
      {!hideNavbar && token && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/change-password/:id" element={<ChangePasswordPage />} />
        {/* Dynamic redirect for "/" */}
        <Route path="/" element={<Navigate to={getDefaultRedirect()} replace />} />
        {/* Admin-only route */}
        <Route element={<PrivateRoute requiredRole="ROLE_ADMIN" />}>
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/new" element={<AddEditUserPage />} />
          <Route path="/users/edit/:id" element={<AddEditUserPage />} />
        </Route>

        {/* Manager/Sales routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/new" element={<AddEditProductPage />} />
          <Route path="/products/edit/:id" element={<AddEditProductPage />} />
          <Route path="/movement" element={<MovementPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Router>
  );
}


