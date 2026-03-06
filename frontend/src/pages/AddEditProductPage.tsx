import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Product } from "../models/Products";
import { createProduct, getProductById, updateProduct } from "../api/products";
import {
  ErrorText,
  FormContainer,
  FormGroup,
  Input,
  Label,
  MessageOtherAction,
  ModalBackgroundAndPosition,
  ModalContainer,
  PrimaryButton,
  SecondaryButton,
  Title,
  Wrapper,
} from "../components/StyledComponents";

export const AddEditProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState<Product>({
    name: "",
    type: "",
    brand: "",
    dueDate: "",
    quantity: 0,
  });
  const [showModal, setShowModal] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      loadProduct(id);
    }
  }, [id]);

  const loadProduct = async (productId: string) => {
    try {
      const product = await getProductById(productId);
      setForm(product);
    } catch (err) {
      console.error("Error al cargar el producto", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    if (!form.name.trim()) newErrors.name = "El nombre del producto es obligatorio";
    if (!form.type.trim()) newErrors.type = "El tipo de producto es obligatorio";
    if (!form.brand.trim()) newErrors.brand = "La marca es obligatoria";
    if (!form.dueDate.trim()) {
      newErrors.dueDate = "La fecha de caducidad es obligatoria";
    } else {
      const selectedDate = new Date(form.dueDate);
      if (selectedDate < tomorrow) {
        newErrors.dueDate = "La fecha de caducidad debe ser desde mañana en adelante";
      }
    }
    if (!form.quantity || form.quantity <= 0) newErrors.quantity = "La cantidad debe ser mayor a 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEditing && id) {
        await updateProduct(id, form);
      } else {
        await createProduct(form);
      }
      setShowModal(true);
    } catch (err) {
      console.error("Error al guardar el producto", err);
    }
  };
  const goToProducts = (): void => {
      navigate("/products");
    };
    const handleModalConfirm = (): void => {
      setShowModal(false);
      goToProducts();
    };

  return (
    <Wrapper>
      <FormContainer>
        <Title>{isEditing ? "Editar Producto" : "Agregar Producto Nuevo"}</Title>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Nombre de producto</Label>
            <Input
              id="name"
              name="name"
              placeholder="Nombre producto"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && <ErrorText>{errors.name}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="type">Tipo de producto</Label>
            <Input
              id="type"
              name="type"
              placeholder="Tipo de producto"
              value={form.type}
              onChange={handleChange}
            />
            {errors.type && <ErrorText>{errors.type}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="brand">Marca</Label>
            <Input
              id="brand"
              name="brand"
              placeholder="Marca"
              value={form.brand}
              onChange={handleChange}
            />
            {errors.brand && <ErrorText>{errors.brand}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="dueDate">Fecha de caducidad</Label>
            <Input
              type="date"
              name="dueDate"
              id="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              min={new Date(Date.now() + 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0]}
            />
            {errors.dueDate && <ErrorText>{errors.dueDate}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="quantity">Cantidad</Label>
            <Input
              type="number"
              name="quantity"
              id="quantity"
              placeholder="Cantidad"
              value={form.quantity}
              onChange={handleChange}
            />
            {errors.quantity && <ErrorText>{errors.quantity}</ErrorText>}
          </FormGroup>

          <PrimaryButton type="submit">
            {isEditing ? "Guardar Cambios" : "Agregar Producto"}
          </PrimaryButton>
        </form>

        <MessageOtherAction></MessageOtherAction>
        <SecondaryButton onClick={() => navigate(-1)}>Cancelar</SecondaryButton>
      </FormContainer>
      {showModal && (
                  <ModalBackgroundAndPosition>
                    <ModalContainer>
                      <p>¡Operacion exitosa!</p>
                      <PrimaryButton onClick={handleModalConfirm}>Aceptar</PrimaryButton>
                    </ModalContainer>
                  </ModalBackgroundAndPosition>
                )}
    </Wrapper>
  );
};
