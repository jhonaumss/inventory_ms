// src/pages/SalesPage.tsx
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Button, Header, IconButton, PageContainer, Table, Td, Th, Title2, Tr } from "../components/StyledComponents";
import { FiMinus, FiPlus, FiTrash } from "react-icons/fi";
import { toast } from "react-toastify";
import { createMovement } from "../api/inventoryManagement";
import { useState } from "react";

export const MovementPage = () => {
    const { items, updateQuantity, removeItem, clearCart } = useCart();
    const { roles } = useAuth();
    const navigate = useNavigate();
    const [reasonMovement, setReasonMovement] = useState("SALE");

    const canMoveProducts = roles.includes("ROLE_SALES") || roles.includes("ROLE_MANAGER");

    if (!canMoveProducts) {
        return (
            <PageContainer>
                <Header>
                    <Title2>Ventas</Title2>
                </Header>
                <p>No tienes permisos para realizar ventas.</p>
            </PageContainer>
        );
    }

    const handleDecrease = (productId: string, currentQty: number) => {
        if (currentQty > 1) {
            updateQuantity(productId, currentQty - 1);
        }
    };

    const handleIncrease = (productId: string, currentQty: number, maxQty: number) => {
        if (currentQty < maxQty) {
            updateQuantity(productId, currentQty + 1);
        } else {
            toast.warning("No hay más stock disponible para este producto.");
        }
    };

    const handleRemove = (productId: string) => {
        removeItem(productId);
    };

    const handleProceed = async () => {
        if (items.length === 0) {
            toast.error("No hay productos en el carrito.");
            return;
        }

        try {
            await createMovement({
                items: items.map((i) => ({
                    productId: i.productId,
                    quantity: i.quantity,
                    type: roles.includes("ROLE_SALES") ? "SALE" : reasonMovement,
                })),
            });

            toast.success("Venta realizada correctamente.");
            clearCart();
            navigate("/products");
        } catch (err: any) {
            const msg =
                err.response?.data?.error || "Error al procesar el movimiento. Intenta nuevamente.";
            toast.error(msg);
        }
    };

    return (
        <PageContainer>
            <Header>
                <Title2>Carrito de ventas</Title2>
            </Header>

            {items.length === 0 ? (
                <p>No hay productos en el carrito.</p>
            ) : (
                <>
                    <Table>
                        <thead>
                            <tr>
                                <Th>Producto</Th>
                                <Th>Cantidad</Th>
                                <Th>Acciones</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <Tr key={item.productId}>
                                    <Td>{item.name}</Td>
                                    <Td>
                                        <IconButton
                                            type="button"
                                            onClick={() => handleDecrease(item.productId, item.quantity)}
                                        >
                                            <FiMinus />
                                        </IconButton>
                                        <span style={{ margin: "0 8px" }}>{item.quantity}</span>
                                        <IconButton
                                            type="button"
                                            onClick={() =>
                                                handleIncrease(item.productId, item.quantity, item.maxQuantity)
                                            }
                                        >
                                            <FiPlus />
                                        </IconButton>
                                    </Td>

                                    <Td>
                                        <IconButton
                                            type="button"
                                            onClick={() => handleRemove(item.productId)}
                                        >
                                            <FiTrash />
                                        </IconButton>
                                    </Td>
                                </Tr>
                            ))}
                        </tbody>
                    </Table>

                    {roles.includes("ROLE_MANAGER") && <div style={{textAlign: "right", marginTop: "16px"}}>
                        <label htmlFor="movementReason">Motivo movimiento: </label>
                        <select
                            id="movementReason"
                            value={reasonMovement}
                            onChange={(e) => setReasonMovement(e.target.value)}
                        >
                            <option value="SALE">Venta</option>
                            <option value="ADJUSTMENT">Ajuste</option>
                            <option value="DAMAGE">Daño</option>
                            <option value="RETURN">Devolución</option>
                        </select>
                    </div>}
                    <div style={{ marginTop: "16px", textAlign: "right" }}>
                        <Button onClick={handleProceed}>{roles.includes("ROLE_SALES") ? 'Registrar venta' : 'Registrar movimiento'}</Button>
                    </div>
                </>
            )}
        </PageContainer>
    );
};
