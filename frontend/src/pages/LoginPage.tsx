import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { AuthResponse, LoginRequest } from "../types/auth";
import { ErrorMessage, FormContainer, Input, PasswordWrapper, PrimaryButton, Title, TogglePassword, Wrapper } from "../components/StyledComponents";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";
import axios from "axios";


function LoginPage() {
  const [form, setForm] = useState<LoginRequest>({ username: "", password: "" });
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setError("");
  try {
    const res = await axios.post<AuthResponse>(
      "http://localhost:8080/api/auth/login",
      form,
      { headers: { "Content-Type": "application/json" } }
    );

    const { token, mustChangePassword, id } = res.data;
    login(token, id);

    if (mustChangePassword) {
      navigate(`/change-password/${id}`);
    } else {
      navigate("/");
    }
  } catch (err: any) {
    const code = err.response?.data?.code;

    if (code === "ACCOUNT_LOCKED") {
      toast.error("Tu cuenta está bloqueada. Intenta de nuevo en 15 minutos.");
    } else if (code === "PASSWORD_EXPIRED") {
      navigate("/change-password");
    } else {
      setError("Usuario o contraseña incorrectos");
      toast.error("Usuario o contraseña incorrectos");
    }
  }
};
  return (
    <Wrapper>
      <FormContainer>
        <Title>Iniciar Sesión</Title>
        <form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Input type="text" name="username" placeholder="Nombre de usuario" value={form.username} onChange={handleChange} />
          <PasswordWrapper>
            <Input type={showPassword ? "text" : "password"} name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required />
            <TogglePassword
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </TogglePassword>
          </PasswordWrapper>
          <PrimaryButton type="submit">Ingresar</PrimaryButton>
        </form>
      </FormContainer>
    </Wrapper>
  );
}

export default LoginPage;
