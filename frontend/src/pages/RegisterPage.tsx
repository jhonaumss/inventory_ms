import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setupInterceptors } from "../api/setupInterceptors";
import type { UserRequest } from "../types/auth";
import { FormContainer, Input, MessageOtherAction, ModalBackgroundAndPosition, ModalContainer, PrimaryButton, SecondaryButton, Select, Title, Wrapper } from "../components/StyledComponents";

function RegisterPage() {
  const [form, setForm] = useState<UserRequest>({
    username: "",
    email: "",
    password: "",
    role: "ROLE_SALES",
  });
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const navigate = useNavigate();

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
      const api = setupInterceptors();
      await api.post("/auth/register", form);
      setShowModal(true);
    } catch {
      setError("Error registrando usuario");
    }
  };

  const goToLogin = (): void => {
    navigate("/login");
  };

  const handleModalConfirm = (): void => {
    setShowModal(false);
    navigate("/login");
  };

  return (
    <Wrapper>
      <FormContainer>
        <Title>Registro de usuarios</Title>
        <form onSubmit={handleSubmit}>
          <Input type="text" name="username" placeholder="Nombre de usuario" value={form.username} onChange={handleChange} />
          <Input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <Input type="password" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} />
          <Select name="role" value={form.role} onChange={handleSelectChange}>
                        <option value="Administrador">Administrador</option>
                        <option value="Trabajador">Trabajador</option>
                    </Select>
          <PrimaryButton type="submit">Registrarse</PrimaryButton>
        </form>
        {error && (
          <p style={{ color: "red", textAlign: "center", margin: "10px 0" }}>{error}</p>
        )}
        <MessageOtherAction>
        </MessageOtherAction>
        <SecondaryButton onClick={goToLogin} >Cancelar</SecondaryButton>
      </FormContainer>
      {showModal && (
        <ModalBackgroundAndPosition>
          <ModalContainer>
            <p>¡Registro exitoso! ¿Deseas iniciar sesión?</p>
            <PrimaryButton onClick={handleModalConfirm}>Aceptar</PrimaryButton>
          </ModalContainer>
        </ModalBackgroundAndPosition>
      )}
    </Wrapper>
  );
}

export default RegisterPage;
