import { useEffect, useState } from "react";
import { fetchProducts, deleteProduct } from "../api/products";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button, Header, IconButton, Input2, PageContainer, Table, Td, Th, Title2, Tr } from "../components/StyledComponents";
import { ConfirmModal } from "../components/ConfirmModal";
import { FiEdit, FiShoppingCart, FiTrash } from "react-icons/fi";
import type { Product } from "../models/Products";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();
  const { roles } = useAuth();
  const { addItem } = useCart();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await fetchProducts();
    setProducts(data);
  };

  const handleDelete = async (product: Product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCart = (product: Product) => {
    addItem(product);
    toast.success(`Producto "${product.name}" agregado al carrito de ventas`);
  };

  const handleConfirmDelete = async () => {
    if (selectedProduct && selectedProduct.id !== undefined) {
      await deleteProduct(selectedProduct.id);
      setShowModal(false);
      setSelectedProduct(null);
      loadProducts();
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCancelDelete = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const WARNING_DAYS = 7;

  type ExpiryStatus = "ok" | "warning" | "expired";

  const getExpiryStatus = (dueDateStr?: string): ExpiryStatus => {
    if (!dueDateStr) return "ok";
    // parse YYYY-MM-DD safely as local date start
    const parts = dueDateStr.split("-");
    if (parts.length < 3) return "ok";
    const year = Number(parts[0]);
    const month = Number(parts[1]) - 1; // months are 0-based
    const day = Number(parts[2]);
    const dueDate = new Date(year, month, day, 0, 0, 0, 0);

    const now = new Date();
    // normalize now to start of today
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

    // difference in ms
    const diffMs = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)); // days from today to dueDate

    if (diffDays <= 0) return "expired"; // already past
    if (diffDays <= WARNING_DAYS) return "warning";
    return "ok";
  };

  const getCartButton = (isAvailableForSale:boolean, currentProduct:Product) => {
   return <IconButton title={!isAvailableForSale? 'No disponible para venta':''} disabled={!isAvailableForSale} onClick={() => handleCart(currentProduct)}><FiShoppingCart/></IconButton>
  }

  const renderDueDateWithBadge = (status:string, dueDate?: string) => {
    const badgeStyle: React.CSSProperties = {
      display: "inline-block",
      marginLeft: 8,
      padding: "2px 8px",
      borderRadius: 12,
      fontSize: 12,
      fontWeight: 600,
      verticalAlign: "middle",
    };

    if (status === "warning") {
      return (
        <>
          {dueDate}
          <span
            style={{
              ...badgeStyle,
              backgroundColor: "#FBBF24", // amber-400
              color: "#ffffffff",
            }}
            aria-label="Warning: producto cercano a vencer"
            title="Producto cercano a vencer"
          >
            Warning
          </span>
        </>
      );
    } else if (status === "expired") {
      return (
        <>
          {dueDate}
          <span
            style={{
              ...badgeStyle,
              backgroundColor: "#DC2626", // red-600
              color: "#fff",
            }}
            aria-label="Expired: producto vencido"
            title="Producto vencido"
          >
            Expired
          </span>
        </>
      );
    } else {
      return <>{dueDate}</>;
    }
  };

  return (
    <PageContainer>
      <Header>
        <Title2>Productos</Title2>
        {(roles.includes("ROLE_MANAGER")) && (
          <Button onClick={() => navigate("/products/new")}>Agregar Producto</Button>
        )}
      </Header>

      <Input2
        type="text"
        placeholder="Buscar Productos"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Table>
        <thead>
          <tr>
            <Th>Nombre</Th>
            <Th>Tipo</Th>
            <Th>Marca</Th>
            <Th>Fecha de caducidad</Th>
            <Th>Cantidad</Th>
            {(roles.some(role => ["ROLE_MANAGER", "ROLE_SALES"].includes(role))) && (
              <Th>Acciones</Th>
            )}
          </tr>
        </thead>
        <tbody>
          {filtered.map((currentProduct) => {
            const expiredStatus = getExpiryStatus(currentProduct.dueDate);
            const isAvailableForSale = expiredStatus !== "expired" || currentProduct.quantity == 0;
            return (
            <Tr key={currentProduct.id}>
              <Td>{currentProduct.name}</Td>
              <Td>{currentProduct.type}</Td>
              <Td>{currentProduct.brand}</Td>
              <Td>{renderDueDateWithBadge(expiredStatus, currentProduct.dueDate)}</Td>
              <Td>{currentProduct.quantity}</Td>
              {(roles.includes("ROLE_MANAGER")) && (
                <td>
                  <IconButton onClick={() => navigate(`/products/edit/${currentProduct.id}`)}><FiEdit/></IconButton>
                  <IconButton onClick={() => handleDelete(currentProduct)}><FiTrash/></IconButton>
                  {getCartButton(isAvailableForSale, currentProduct)}
                </td>
              )}
              {(roles.includes("ROLE_SALES")) && (
                <td>
                  <IconButton title={!isAvailableForSale? 'No disponible para venta':''} disabled={!isAvailableForSale} onClick={() => handleCart(currentProduct)}><FiShoppingCart/></IconButton>
                </td>
              )}
            </Tr>
          )})}
        </tbody>
      </Table>
      {selectedProduct && (
        <ConfirmModal
          show={showModal}
          title="Confirmar borrar producto"
          message={`¿Estás seguro de eliminar el producto "${selectedProduct.name}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </PageContainer>
  );
}
