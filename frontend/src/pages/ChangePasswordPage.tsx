import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
    Wrapper,
    FormContainer,
    FormGroup,
    Input,
    Label,
    PrimaryButton,
    SecondaryButton,
    Title,
    ErrorText,
} from "../components/StyledComponents";
import { updateUserPassword } from "../api/users";

/* ---- Styled components locales ---- */
const PasswordWrapperLocal = styled.div`
  position: relative;
  width: 100%;
`;

const TogglePasswordLocal = styled.button`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  display: flex;
  align-items: center;

  &:hover {
    color: #4f46e5;
  }
`;

const Requirements = styled.ul`
  list-style: none;
  padding: 8px 12px;
  margin: 8px 0 0 0;
  background: #fafafa;
  border: 1px solid #eef2ff;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #374151;
`;

const ReqItem = styled.li<{ $ok: boolean }>`
  color: ${({ $ok }) => ($ok ? "#16a34a" : "#dc2626")};
  margin: 4px 0;
  &::before {
    content: ${({ $ok }) => ($ok ? "'✔ '" : "'✖ '")};
    margin-right: 4px;
  }
`;

const StrengthBar = styled.div`
  height: 8px;
  width: 100%;
  background: #e6e6e6;
  border-radius: 6px;
  margin-top: 8px;
  overflow: hidden;
`;

const StrengthFill = styled.div<{ $level: number }>`
  height: 100%;
  width: ${({ $level }) => Math.min(100, $level)}%;
  transition: width 180ms ease;
  background: ${({ $level }) =>
        $level < 40 ? "#ef4444" : $level < 75 ? "#f59e0b" : "#10b981"};
`;

/* ---- Helper: password checks ---- */
const getPasswordChecks = (pwd: string) => {
    return {
        length: pwd.length >= 12,
        upper: /[A-Z]/.test(pwd),
        lower: /[a-z]/.test(pwd),
        number: /[0-9]/.test(pwd),
        symbol: /[@$!%*?&]/.test(pwd),
    };
};

const calcStrengthPercent = (checks: ReturnType<typeof getPasswordChecks>) => {
    const total = Object.values(checks).length;
    const passed = Object.values(checks).filter(Boolean).length;
    return Math.round((passed / total) * 100);
};

export default function ChangePasswordPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { logout } = useAuth();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const checks = getPasswordChecks(newPassword);
    const strength = calcStrengthPercent(checks);

    const confirmError =
        confirmPassword.length === 0 ? "Confirma la nueva contraseña" : null;

    const mismatchError =
        newPassword && confirmPassword && newPassword !== confirmPassword
            ? "Las contraseñas no coinciden"
            : null;

    const validityError = (() => {
        if (!checks.length) return "Debe tener al menos 12 caracteres";
        if (!checks.upper) return "Debe incluir una letra mayúscula";
        if (!checks.lower) return "Debe incluir una letra minúscula";
        if (!checks.number) return "Debe incluir un número";
        if (!checks.symbol) return "Debe incluir un símbolo (@$!%*?&)";
        return null;
    })();

    const canSubmit =
        oldPassword.length > 0 &&
        newPassword.length > 0 &&
        confirmPassword.length > 0 &&
        !mismatchError &&
        !validityError &&
        !loading;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError(null);
        if (!canSubmit) return;

        setLoading(true);
        try {
            await updateUserPassword(id!, {
                oldPassword,
                newPassword
            })
            toast.success("Contraseña cambiada correctamente. Vuelva a iniciar sesión.");
            // Forzar logout para que el usuario ingrese con la nueva contraseña
            logout();
            navigate("/login");
        } catch (err: any) {
            console.error(err);
            // Tratar distintos errores posibles
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Error al cambiar la contraseña";
            setServerError(String(msg));
            toast.error("No se pudo cambiar la contraseña");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Wrapper>
            <FormContainer style={{ maxWidth: 520, width: "100%" }}>
                <Title>Cambiar contraseña</Title>

                <form onSubmit={handleSubmit} noValidate>
                    <FormGroup>
                        <Label htmlFor="oldPassword">Contraseña actual</Label>
                        <PasswordWrapperLocal>
                            <Input
                                id="oldPassword"
                                name="oldPassword"
                                type={showOld ? "text" : "password"}
                                placeholder="Ingrese su contraseña actual"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                            <TogglePasswordLocal
                                type="button"
                                onClick={() => setShowOld((s) => !s)}
                                aria-label={showOld ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showOld ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </TogglePasswordLocal>
                        </PasswordWrapperLocal>
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="newPassword">Nueva contraseña</Label>
                        <PasswordWrapperLocal>
                            <Input
                                id="newPassword"
                                name="newPassword"
                                type={showNew ? "text" : "password"}
                                placeholder="Ingrese la nueva contraseña"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <TogglePasswordLocal
                                type="button"
                                onClick={() => setShowNew((s) => !s)}
                                aria-label={showNew ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showNew ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </TogglePasswordLocal>
                        </PasswordWrapperLocal>

                        {/* Requisitos y barra de fuerza */}
                        <Requirements aria-live="polite">
                            <ReqItem $ok={checks.length}>Al menos 12 caracteres</ReqItem>
                            <ReqItem $ok={checks.upper}>Una letra mayúscula (A-Z)</ReqItem>
                            <ReqItem $ok={checks.lower}>Una letra minúscula (a-z)</ReqItem>
                            <ReqItem $ok={checks.number}>Un número (0-9)</ReqItem>
                            <ReqItem $ok={checks.symbol}>Un símbolo (@$!%*?&)</ReqItem>

                            <StrengthBar aria-hidden>
                                <StrengthFill $level={strength} />
                            </StrengthBar>
                        </Requirements>

                        {validityError && <ErrorText>{validityError}</ErrorText>}
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                        <PasswordWrapperLocal>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirm ? "text" : "password"}
                                placeholder="Repita la nueva contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <TogglePasswordLocal
                                type="button"
                                onClick={() => setShowConfirm((s) => !s)}
                                aria-label={showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </TogglePasswordLocal>
                        </PasswordWrapperLocal>

                        {mismatchError && <ErrorText>{mismatchError}</ErrorText>}
                        {confirmError && <ErrorText>{confirmError}</ErrorText>}
                    </FormGroup>

                    {serverError && <ErrorText>{serverError}</ErrorText>}

                    <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                        <PrimaryButton type="submit" disabled={!canSubmit}>
                            {loading ? "Guardando..." : "Cambiar contraseña"}
                        </PrimaryButton>
                        <SecondaryButton
                            type="button"
                            onClick={() => {
                                navigate(-1);
                            }}
                        >
                            Cancelar
                        </SecondaryButton>
                    </div>
                </form>
            </FormContainer>
        </Wrapper>
    );
}
