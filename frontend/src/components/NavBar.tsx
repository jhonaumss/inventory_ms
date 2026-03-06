import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Brand, CartBadge, CartIconWrapper, LogoutButton, NavbarContainer, NavItem, RightSection, UserLabel } from "./StyledComponents";
import { useCart } from "../context/CartContext";
import { FiShoppingCart } from "react-icons/fi";
import { NotificationBell } from "./NotificationBell";

export const Navbar = () => {
    const { user, roles, logout } = useContext(AuthContext);
    const { totalItems } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <NavbarContainer>
            <Brand to={roles.includes('ROLE_ADMIN') ? "/users" : "/products"}>
                🧾 Inventory App
            </Brand>
            <RightSection>
                {roles.includes('ROLE_ADMIN') && (
                    <NavItem onClick={() => navigate("/users")}>Usuarios</NavItem>
                )}
                {(roles.includes('ROLE_MANAGER') || roles.includes('ROLE_SALES')) && (
                    <NavItem onClick={() => navigate("/products")}>Productos</NavItem>
                )}
                
                {(roles.includes('ROLE_MANAGER') || roles.includes('ROLE_SALES')) && (
                    <CartIconWrapper onClick={() => navigate("/movement")} aria-label="Ver carrito">
                        <FiShoppingCart size={20} color="#000000" />
                        {totalItems > 0 && <CartBadge>{totalItems}</CartBadge>}
                    </CartIconWrapper>
                )}
                {(roles.includes('ROLE_MANAGER') || roles.includes('ROLE_SALES')) && (
                    <NotificationBell/>
                )}
                <UserLabel>{user}</UserLabel>
                <LogoutButton onClick={handleLogout}>Cerrar Sesion</LogoutButton>
            </RightSection>
        </NavbarContainer>
    );
};

