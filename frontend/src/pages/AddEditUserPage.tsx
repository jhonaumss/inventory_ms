import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {  FormContainer,  Input,  MessageOtherAction, ModalBackgroundAndPosition, ModalContainer, PrimaryButton, SecondaryButton, Select, Title, Wrapper } from "../components/StyledComponents";
import type { User } from "../models/User";
import { createUser, getUserById, updateUser } from "../api/users";

export const AddEditUserPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState<User>({
    username: "",
    email: "",
    role: "ROLE_SALES",
  });
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      loadUser(id);
    }
  }, [id]);
  const loadUser = async (userId: string) => {
    try {
      const user = await getUserById(userId);
      setForm(user);
    } catch (err) {
      console.error("Error al cargar el usuario", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isEditing && id) {
        await updateUser(id, form);
      } else {
        await createUser(form);
      }
      setShowModal(true);
    } catch (err: any) {
      setError("Error registrando usuario");
    }
  };

  const goToUsers = (): void => {
    navigate("/users");
  };

  const handleModalConfirm = (): void => {
    setShowModal(false);
    goToUsers();
  };

  return (
    <Wrapper>
      <FormContainer>
        <Title>{isEditing ? "Editar usuario" : "Registro de usuarios"}</Title>
        <form onSubmit={handleSubmit}>
          <Input type="text" name="username" placeholder="Nombre de usuario" value={form.username} onChange={handleChange} />
          <Input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <Select name="role" value={form.role} onChange={handleSelectChange}>
            <option value="ROLE_ADMIN">Administrador</option>
            <option value="ROLE_MANAGER">Gerente</option>
            <option value="ROLE_SALES">Vendedor</option>
          </Select>
          <PrimaryButton type="submit">{isEditing ? "Editar usuario" : "Registro de usuarios"}</PrimaryButton>
        </form>
        {error && (
          <p style={{ color: "red", textAlign: "center", margin: "10px 0" }}>{error}</p>
        )}
        <MessageOtherAction>
        </MessageOtherAction>
        <SecondaryButton onClick={goToUsers} >Cancelar</SecondaryButton>
      </FormContainer>
      {showModal && (
        <ModalBackgroundAndPosition>
          <ModalContainer>
            <p>¡Registro exitoso!</p>
            <PrimaryButton onClick={handleModalConfirm}>Aceptar</PrimaryButton>
          </ModalContainer>
        </ModalBackgroundAndPosition>
      )}
    </Wrapper>
  );
};
